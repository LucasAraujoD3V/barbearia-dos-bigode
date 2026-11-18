import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { servicosPadrao } from '../data/barbearia';
import { mensagemErro } from '../utils/formatar';

export default function useServicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let jaSemeou = false;
    const consulta = query(collection(db, 'servicos'), orderBy('ordem'));

    const cancelar = onSnapshot(
      consulta,
      async (snap) => {
        if (snap.empty && !jaSemeou) {
          jaSemeou = true;
          const lote = writeBatch(db);
          servicosPadrao.forEach(({ id, ...servico }, indice) => {
            lote.set(doc(db, 'servicos', id), { ...servico, ordem: indice });
          });
          try {
            await lote.commit();
          } catch (e) {
            setErro(mensagemErro(e));
            setCarregando(false);
          }
          return;
        }
        setServicos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setErro('');
        setCarregando(false);
      },
      (e) => {
        setErro(mensagemErro(e));
        setCarregando(false);
      }
    );

    return cancelar;
  }, []);

  return { servicos, carregando, erro };
}
