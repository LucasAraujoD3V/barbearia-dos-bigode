import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import Text from '../components/Texto';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import FundoFoto from '../components/FundoFoto';
import { barbearia } from '../data/barbearia';
import { fotos } from '../data/fotos';
import { cores } from '../theme/cores';
import { dataISO } from '../utils/formatar';
import { confirmar } from '../utils/dialogo';

const itens = [
  { id: 'horarios', titulo: 'Horários', subtitulo: 'Agende sua cadeira', icone: 'calendar-clock', destino: 'Horarios', foto: fotos.cadeira },
  { id: 'servicos', titulo: 'Serviços', subtitulo: 'Cortes, barba e bigode', icone: 'content-cut', destino: 'Servicos', foto: fotos.barba },
  { id: 'produtos', titulo: 'Produtos', subtitulo: 'Pomadas, óleos e balms', icone: 'package-variant', destino: 'Produtos', foto: fotos.couro },
  { id: 'loja', titulo: 'A Loja', subtitulo: 'Nossa história', icone: 'storefront-outline', destino: 'Loja', foto: fotos.salao },
  { id: 'cadProduto', titulo: 'Cad. Produtos', subtitulo: 'Incluir e editar', icone: 'package-variant-plus', destino: 'CadastroProduto', foto: fotos.listrada },
  { id: 'cadCliente', titulo: 'Cad. Clientes', subtitulo: 'Fichas dos clientes', icone: 'account-multiple-plus', destino: 'CadastroCliente', foto: fotos.espelho },
  { id: 'mapa', titulo: 'Localização', subtitulo: 'Como chegar', icone: 'map-marker-radius', destino: 'Mapa', foto: fotos.poltrona },
  { id: 'whatsapp', titulo: 'WhatsApp', subtitulo: 'Fale com a gente', icone: 'whatsapp', link: `https://wa.me/${barbearia.whatsapp}`, foto: fotos.corte },
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
  const insets = useSafeAreaInsets();
  const { dados: meus } = useApi('/agendamentos/meus');
  const hoje = dataISO(new Date());
  const proximo = (meus || []).find((a) => a.data >= hoje) || null;

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

  const primeiroNome = (usuario?.nome || usuario?.email || '').split(/[ @]/)[0];

  function textoProximo() {
    const [ano, mes, dia] = proximo.data.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return `${diasSemana[data.getDay()]}, ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')} às ${proximo.hora}`;
  }

  const cabecalho = (
    <View>
      <FundoFoto
        foto={fotos.corte}
        degrade={['rgba(20,17,15,0.25)', 'rgba(20,17,15,0.7)', cores.fundo]}
        style={[mascara.hero, { paddingTop: insets.top + 16 }]}
      >
        <View style={mascara.topo}>
          <View style={mascara.marca}>
            <MaterialCommunityIcons name="mustache" size={22} color={cores.dourado} />
            <Text style={mascara.marcaTexto}>BARBEARIA DOS BIGODE</Text>
          </View>
          <TouchableOpacity onPress={confirmarSaida} style={mascara.botaoSair} hitSlop={8}>
            <MaterialCommunityIcons name="logout" size={20} color={cores.creme} />
          </TouchableOpacity>
        </View>
        <Text style={mascara.saudacao}>{saudacao()},</Text>
        <Text style={mascara.nome} numberOfLines={1}>{primeiroNome}</Text>
      </FundoFoto>

      <View style={mascara.corpo}>

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
    </View>
  );

  return (
    <View style={mascara.casca}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={mascara.lista}
        columnWrapperStyle={mascara.linha}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} style={mascara.cartao} onPress={() => abrir(item)}>
            <FundoFoto
              foto={item.foto}
              degrade={['rgba(20,17,15,0.15)', 'rgba(20,17,15,0.55)', 'rgba(20,17,15,0.95)']}
              style={mascara.cartaoFoto}
            >
              <View style={mascara.iconeCirculo}>
                <MaterialCommunityIcons name={item.icone} size={22} color={cores.dourado} />
              </View>
              <View>
                <Text style={mascara.cartaoTitulo}>{item.titulo}</Text>
                <Text style={mascara.cartaoSub}>{item.subtitulo}</Text>
              </View>
            </FundoFoto>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    paddingBottom: 32,
  },
  linha: {
    gap: 14,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  corpo: {
    paddingHorizontal: 20,
    marginTop: -32,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marcaTexto: {
    color: cores.creme,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  topoTextos: {
    flex: 1,
  },
  saudacao: {
    color: '#D8CCB8',
    fontSize: 16,
  },
  nome: {
    color: cores.creme,
    fontWeight: '800',
    letterSpacing: -0.8,
    fontSize: 36,
    textTransform: 'capitalize',
  },
  botaoSair: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,17,15,0.55)',
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
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cartaoFoto: {
    flex: 1,
    minHeight: 160,
    padding: 14,
    justifyContent: 'space-between',
  },
  iconeCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,17,15,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartaoTitulo: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: '700',
  },
  cartaoSub: {
    color: '#D8CCB8',
    fontSize: 12,
    marginTop: 2,
  },
});
