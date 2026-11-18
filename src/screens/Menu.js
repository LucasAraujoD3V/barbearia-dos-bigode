import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { barbearia } from '../data/barbearia';
import { cores, fontes } from '../theme/cores';
import { dataISO } from '../utils/formatar';
import { confirmar } from '../utils/dialogo';

const itens = [
  { id: 'horarios', titulo: 'Horários', subtitulo: 'Agende sua cadeira', icone: 'calendar-clock', destino: 'Horarios' },
  { id: 'servicos', titulo: 'Serviços', subtitulo: 'Cortes, barba e bigode', icone: 'content-cut', destino: 'Servicos' },
  { id: 'produtos', titulo: 'Produtos', subtitulo: 'Pomadas, óleos e balms', icone: 'package-variant', destino: 'Produtos' },
  { id: 'loja', titulo: 'A Loja', subtitulo: 'Nossa história', icone: 'storefront-outline', destino: 'Loja' },
  { id: 'cadProduto', titulo: 'Cad. Produtos', subtitulo: 'Incluir e editar', icone: 'package-variant-plus', destino: 'CadastroProduto' },
  { id: 'cadCliente', titulo: 'Cad. Clientes', subtitulo: 'Fichas dos clientes', icone: 'account-multiple-plus', destino: 'CadastroCliente' },
  { id: 'mapa', titulo: 'Localização', subtitulo: 'Como chegar', icone: 'map-marker-radius', destino: 'Mapa' },
  { id: 'whatsapp', titulo: 'WhatsApp', subtitulo: 'Fale com a gente', icone: 'whatsapp', link: `https://wa.me/${barbearia.whatsapp}` },
];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Menu({ navigation }) {
  const { usuario, sair } = useAuth();
  const [nome, setNome] = useState(usuario?.displayName || '');
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    if (!usuario) return undefined;
    const cancelar = onSnapshot(doc(db, 'usuarios', usuario.uid), (snap) => {
      if (snap.exists() && snap.data().nome) setNome(snap.data().nome);
    }, () => {});
    return cancelar;
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return undefined;
    const consulta = query(collection(db, 'agendamentos'), where('usuarioId', '==', usuario.uid));
    const cancelar = onSnapshot(consulta, (snap) => {
      const hoje = dataISO(new Date());
      const futuros = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.data >= hoje)
        .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`));
      setProximo(futuros[0] || null);
    }, () => {});
    return cancelar;
  }, [usuario]);

  function confirmarSaida() {
    confirmar('Sair', 'Deseja mesmo sair da sua conta?', sair, 'Sair', true);
  }

  function abrir(item) {
    if (item.link) {
      Linking.openURL(item.link);
      return;
    }
    navigation.navigate(item.destino);
  }

  const primeiroNome = (nome || usuario?.email || '').split(/[ @]/)[0];

  function textoProximo() {
    const [ano, mes, dia] = proximo.data.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return `${diasSemana[data.getDay()]}, ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')} às ${proximo.hora}`;
  }

  const cabecalho = (
    <View>
      <View style={mascara.topo}>
        <View style={mascara.topoTextos}>
          <Text style={mascara.saudacao}>{saudacao()},</Text>
          <Text style={mascara.nome} numberOfLines={1}>{primeiroNome}</Text>
        </View>
        <TouchableOpacity onPress={confirmarSaida} style={mascara.botaoSair} hitSlop={8}>
          <MaterialCommunityIcons name="logout" size={22} color={cores.textoSecundario} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={mascara.destaque}
        onPress={() => navigation.navigate('Horarios')}
      >
        <View style={mascara.destaqueIcone}>
          <MaterialCommunityIcons name={proximo ? 'calendar-check' : 'mustache'} size={28} color={cores.fundo} />
        </View>
        <View style={mascara.destaqueTextos}>
          <Text style={mascara.destaqueRotulo}>{proximo ? 'SEU PRÓXIMO HORÁRIO' : 'BIGODE EM DIA?'}</Text>
          <Text style={mascara.destaqueTitulo}>
            {proximo ? textoProximo() : 'Reserve seu horário'}
          </Text>
          {proximo?.servico ? <Text style={mascara.destaqueSub}>{proximo.servico}</Text> : null}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={cores.fundo} />
      </TouchableOpacity>

      <Text style={mascara.secao}>Menu</Text>
    </View>
  );

  return (
    <SafeAreaView style={mascara.casca} edges={['top']}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={mascara.lista}
        columnWrapperStyle={mascara.linha}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={mascara.cartao} onPress={() => abrir(item)}>
            <View style={mascara.iconeCirculo}>
              <MaterialCommunityIcons name={item.icone} size={26} color={cores.dourado} />
            </View>
            <Text style={mascara.cartaoTitulo}>{item.titulo}</Text>
            <Text style={mascara.cartaoSub}>{item.subtitulo}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    padding: 20,
    paddingBottom: 32,
  },
  linha: {
    gap: 14,
    marginBottom: 14,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topoTextos: {
    flex: 1,
  },
  saudacao: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
  nome: {
    color: cores.creme,
    fontFamily: fontes.titulo,
    fontSize: 30,
    textTransform: 'capitalize',
  },
  botaoSair: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.dourado,
    borderRadius: 16,
    padding: 16,
  },
  destaqueIcone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(20,17,15,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destaqueTextos: {
    flex: 1,
  },
  destaqueRotulo: {
    color: cores.fundo,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    opacity: 0.7,
  },
  destaqueTitulo: {
    color: cores.fundo,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  destaqueSub: {
    color: cores.fundo,
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  secao: {
    color: cores.textoSecundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 28,
    marginBottom: 14,
  },
  cartao: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
    minHeight: 132,
  },
  iconeCirculo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cartaoTitulo: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: '700',
  },
  cartaoSub: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 2,
  },
});
