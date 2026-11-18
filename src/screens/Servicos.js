import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useServicos from '../hooks/useServicos';
import Vazio from '../components/Vazio';
import { cores, fontes } from '../theme/cores';
import { moeda } from '../utils/formatar';

export default function Servicos({ navigation }) {
  const { servicos, carregando, erro } = useServicos();

  if (carregando) {
    return (
      <View style={mascara.centro}>
        <ActivityIndicator color={cores.dourado} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={mascara.casca}
      contentContainerStyle={mascara.lista}
      data={servicos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={mascara.cabecalho}>
          <Text style={mascara.titulo}>Cardápio da casa</Text>
          <Text style={mascara.subtitulo}>Toalha quente e cafezinho em todos os serviços.</Text>
        </View>
      }
      ListEmptyComponent={
        <Vazio icone="content-cut" titulo="Nenhum serviço encontrado" texto={erro || 'Os serviços aparecem aqui.'} />
      }
      renderItem={({ item }) => (
        <View style={mascara.cartao}>
          <View style={mascara.icone}>
            <MaterialCommunityIcons name={item.icone || 'content-cut'} size={28} color={cores.dourado} />
          </View>
          <View style={mascara.info}>
            <View style={mascara.linhaTitulo}>
              <Text style={mascara.nome}>{item.nome}</Text>
              <Text style={mascara.preco}>{moeda(item.preco)}</Text>
            </View>
            <Text style={mascara.descricao}>{item.descricao}</Text>
            <View style={mascara.rodape}>
              <View style={mascara.duracao}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={cores.textoSecundario} />
                <Text style={mascara.duracaoTexto}>{item.duracao} min</Text>
              </View>
              <TouchableOpacity
                style={mascara.botao}
                onPress={() => navigation.navigate('Horarios', { servicoId: item.id })}
              >
                <Text style={mascara.botaoTexto}>Agendar</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color={cores.dourado} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  centro: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  cabecalho: {
    marginBottom: 18,
  },
  titulo: {
    color: cores.creme,
    fontFamily: fontes.tituloItalico,
    fontSize: 26,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
  },
  cartao: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  nome: {
    color: cores.creme,
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
  },
  preco: {
    color: cores.dourado,
    fontSize: 16,
    fontWeight: '800',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  duracao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duracaoTexto: {
    color: cores.textoSecundario,
    fontSize: 13,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.douradoEscuro,
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 8,
    height: 32,
  },
  botaoTexto: {
    color: cores.dourado,
    fontSize: 13,
    fontWeight: '700',
  },
});
