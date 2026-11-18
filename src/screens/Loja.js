import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Botao from '../components/Botao';
import { barbearia, equipe, diferenciais, funcionamento } from '../data/barbearia';
import { cores, fontes } from '../theme/cores';

const listras = Array.from({ length: 18 }, (_, i) => i);

function Listras() {
  return (
    <View style={mascara.listras}>
      {listras.map((i) => (
        <View
          key={i}
          style={[
            mascara.listra,
            { backgroundColor: i % 3 === 0 ? cores.vermelho : i % 3 === 1 ? cores.creme : '#2E4A7A' },
          ]}
        />
      ))}
    </View>
  );
}

export default function Loja({ navigation }) {
  const contatos = [
    {
      icone: 'whatsapp',
      titulo: 'WhatsApp',
      valor: 'Agende pelo zap',
      link: `https://wa.me/${barbearia.whatsapp}`,
    },
    {
      icone: 'instagram',
      titulo: 'Instagram',
      valor: `@${barbearia.instagram}`,
      link: `https://instagram.com/${barbearia.instagram}`,
    },
    {
      icone: 'phone',
      titulo: 'Telefone',
      valor: barbearia.telefone,
      link: `tel:${barbearia.telefoneLink}`,
    },
  ];

  const semana = funcionamento[1];
  const sexta = funcionamento[5];
  const sabado = funcionamento[6];

  return (
    <ScrollView style={mascara.casca} contentContainerStyle={mascara.conteudo}>
      <View style={mascara.hero}>
        <Logo />
        <Text style={mascara.slogan}>{barbearia.slogan}</Text>
      </View>

      <Listras />

      <Text style={mascara.secao}>Nossa história</Text>
      <Text style={mascara.paragrafo}>{barbearia.sobre}</Text>

      <View style={mascara.diferenciais}>
        {diferenciais.map((d) => (
          <View key={d.texto} style={mascara.diferencial}>
            <MaterialCommunityIcons name={d.icone} size={26} color={cores.dourado} />
            <Text style={mascara.diferencialTexto}>{d.texto}</Text>
          </View>
        ))}
      </View>

      <Text style={mascara.secao}>A equipe</Text>
      {equipe.map((b) => (
        <View key={b.nome} style={mascara.barbeiro}>
          <View style={mascara.avatar}>
            <MaterialCommunityIcons name="mustache" size={26} color={cores.dourado} />
          </View>
          <View style={mascara.barbeiroInfo}>
            <Text style={mascara.barbeiroNome}>{b.nome}</Text>
            <Text style={mascara.barbeiroFuncao}>{b.funcao}</Text>
          </View>
          <Text style={mascara.desde}>desde{'\n'}{b.desde}</Text>
        </View>
      ))}

      <Text style={mascara.secao}>Funcionamento</Text>
      <View style={mascara.cartao}>
        <LinhaHorario dia="Segunda a quinta" valor={`${semana.abre} às ${semana.fecha}`} />
        <LinhaHorario dia="Sexta" valor={`${sexta.abre} às ${sexta.fecha}`} />
        <LinhaHorario dia="Sábado" valor={`${sabado.abre} às ${sabado.fecha}`} />
        <LinhaHorario dia="Domingo" valor="Fechado" fechado />
      </View>

      <Text style={mascara.secao}>Contato</Text>
      <View style={mascara.cartao}>
        {contatos.map((c, i) => (
          <TouchableOpacity
            key={c.titulo}
            style={[mascara.contato, i < contatos.length - 1 && mascara.contatoBorda]}
            onPress={() => Linking.openURL(c.link)}
          >
            <MaterialCommunityIcons name={c.icone} size={22} color={cores.dourado} />
            <View style={mascara.contatoTextos}>
              <Text style={mascara.contatoTitulo}>{c.titulo}</Text>
              <Text style={mascara.contatoValor}>{c.valor}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={cores.textoApagado} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={mascara.secao}>Endereço</Text>
      <View style={mascara.cartao}>
        <Text style={mascara.endereco}>{barbearia.endereco}</Text>
        <Text style={mascara.cidade}>{barbearia.cidade}</Text>
        <Botao
          titulo="Ver no mapa"
          icone="map-marker-radius"
          tipo="contorno"
          onPress={() => navigation.navigate('Mapa')}
          style={mascara.botaoMapa}
        />
      </View>
    </ScrollView>
  );
}

function LinhaHorario({ dia, valor, fechado }) {
  return (
    <View style={mascara.linhaHorario}>
      <Text style={mascara.linhaDia}>{dia}</Text>
      <Text style={[mascara.linhaValor, fechado && mascara.linhaFechado]}>{valor}</Text>
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  slogan: {
    color: cores.textoSecundario,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
  },
  listras: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  listra: {
    flex: 1,
  },
  secao: {
    color: cores.textoSecundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 28,
    marginBottom: 12,
  },
  paragrafo: {
    color: cores.creme,
    fontSize: 15,
    lineHeight: 23,
  },
  diferenciais: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  diferencial: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 12,
  },
  diferencialTexto: {
    color: cores.creme,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  barbeiro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: cores.dourado,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barbeiroInfo: {
    flex: 1,
  },
  barbeiroNome: {
    color: cores.creme,
    fontFamily: fontes.titulo,
    fontSize: 18,
  },
  barbeiroFuncao: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginTop: 2,
  },
  desde: {
    color: cores.dourado,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    padding: 16,
  },
  linhaHorario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  linhaDia: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  linhaValor: {
    color: cores.creme,
    fontSize: 14,
    fontWeight: '700',
  },
  linhaFechado: {
    color: cores.vermelho,
  },
  contato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  contatoBorda: {
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  contatoTextos: {
    flex: 1,
  },
  contatoTitulo: {
    color: cores.creme,
    fontSize: 15,
    fontWeight: '700',
  },
  contatoValor: {
    color: cores.textoSecundario,
    fontSize: 13,
  },
  endereco: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: '700',
  },
  cidade: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 2,
  },
  botaoMapa: {
    marginTop: 14,
  },
});
