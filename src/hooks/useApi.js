import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';

export default function useApi(caminho) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const atual = useRef(caminho);

  useEffect(() => {
    atual.current = caminho;
    setCarregando(true);
  }, [caminho]);

  const recarregar = useCallback(async () => {
    try {
      const resposta = await api(caminho);
      if (atual.current !== caminho) return;
      setDados(resposta);
      setErro('');
    } catch (e) {
      if (atual.current !== caminho) return;
      setErro(e.message);
    } finally {
      if (atual.current === caminho) setCarregando(false);
    }
  }, [caminho]);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar])
  );

  return { dados, carregando, erro, recarregar };
}
