import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useApi from '../hooks/useApi';
import Chip from '../components/Chip';
import Vazio from '../components/Vazio';
import Botao from '../components/Botao';
import { categoriasProduto, iconeCategoria } from '../data/barbearia';
import { cores } from '../theme/cores';
import { moeda } from '../utils/formatar';

export default function Produtos({ navigation }) {
  const { dados: produtos, carregando, erro, recarregar } = useApi('/produtos');
  const [categoria, setCategoria] = useState('Todos');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CadastroProduto')}
          style={mascara.botaoCabecalho}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="plus" size={26} color={cores.dourado} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filtrados = useMemo(() => {
    const lista = categoria === 'Todos' ? produtos : produtos.filter((p) => p.categoria === categoria);
    return lista.length % 2 ? [...lista, { id: 'espaco', espaco: true }] : lista;
  }, [produtos, categoria]);

  if (carregando) {
    return (
      <View style={mascara.centro}>
        <ActivityIndicator color={cores.dourado} size="large" />
      </View>
    );
  }

  return (
    <View style={mascara.casca}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={mascara.filtros}
        contentContainerStyle={mascara.filtrosConteudo}
      >
        <Chip texto="Todos" ativo={categoria === 'Todos'} onPress={() => setCategoria('Todos')} />
        {categoriasProduto.map((c) => (
          <Chip
            key={c.nome}
            texto={c.nome}
            icone={c.icone}
            ativo={categoria === c.nome}
            onPress={() => setCategoria(c.nome)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={false}
        onRefresh={recarregar}
        columnWrapperStyle={mascara.linha}
        contentContainerStyle={mascara.lista}
        ListEmptyComponent={
          <View>
            <Vazio
              icone="package-variant"
              titulo={erro ? 'Erro ao carregar' : 'Nenhum produto por aqui'}
              texto={erro || 'Cadastre os produtos da barbearia para exibir nesta vitrine.'}
            />
            {!erro ? (
              <Botao
                titulo="Cadastrar produto"
                icone="package-variant-plus"
                tipo="contorno"
                onPress={() => navigation.navigate('CadastroProduto')}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          if (item.espaco) return <View style={mascara.espaco} />;
          const esgotado = Number(item.estoque) <= 0;
          const ultimas = !esgotado && Number(item.estoque) <= 3;
          return (
            <View style={[mascara.cartao, esgotado && mascara.cartaoEsgotado]}>
              <View style={mascara.vitrine}>
                <MaterialCommunityIcons name={iconeCategoria(item.categoria)} size={44} color={cores.dourado} />
                {esgotado || ultimas ? (
                  <View style={[mascara.selo, esgotado ? mascara.seloEsgotado : mascara.seloUltimas]}>
                    <Text style={mascara.seloTexto}>{esgotado ? 'Esgotado' : 'Últimas'}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={mascara.categoria}>{item.categoria}</Text>
              <Text style={mascara.nome} numberOfLines={2}>{item.nome}</Text>
              {item.descricao ? (
                <Text style={mascara.descricao} numberOfLines={2}>{item.descricao}</Text>
              ) : null}
              <View style={mascara.rodape}>
                <Text style={mascara.preco}>{moeda(item.preco)}</Text>
                <Text style={mascara.estoque}>{Number(item.estoque) || 0} un.</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
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
  botaoCabecalho: {
    marginRight: 16,
  },
  filtros: {
    flexGrow: 0,
  },
  filtrosConteudo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  linha: {
    gap: 12,
    marginBottom: 12,
  },
  espaco: {
    flex: 1,
  },
  cartao: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 12,
  },
  cartaoEsgotado: {
    opacity: 0.55,
  },
  vitrine: {
    height: 110,
    borderRadius: 12,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selo: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  seloEsgotado: {
    backgroundColor: cores.vermelho,
  },
  seloUltimas: {
    backgroundColor: cores.douradoEscuro,
  },
  seloTexto: {
    color: cores.creme,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  categoria: {
    color: cores.dourado,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nome: {
    color: cores.creme,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 4,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  preco: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: '800',
  },
  estoque: {
    color: cores.textoApagado,
    fontSize: 12,
  },
});
