import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../services/api';
import useApi from '../hooks/useApi';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import Chip from '../components/Chip';
import Vazio from '../components/Vazio';
import { categoriasProduto, iconeCategoria } from '../data/barbearia';
import { cores, fontes } from '../theme/cores';
import { moeda, paraNumero, mensagemErro } from '../utils/formatar';
import { avisar, confirmar } from '../utils/dialogo';

const formularioVazio = {
  nome: '',
  categoria: categoriasProduto[0].nome,
  preco: '',
  estoque: '',
  descricao: '',
};

export default function CadastroProduto() {
  const rolagem = useRef(null);
  const { dados: produtos, carregando, recarregar } = useApi('/produtos');
  const [form, setForm] = useState(formularioVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [salvando, setSalvando] = useState(false);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(
      (p) => p.nome.toLowerCase().includes(termo) || (p.categoria || '').toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function limpar() {
    setForm(formularioVazio);
    setEditandoId(null);
  }

  async function salvar() {
    const preco = paraNumero(form.preco);
    const estoque = parseInt(form.estoque, 10);

    if (!form.nome.trim()) {
      avisar('Atenção', 'Informe o nome do produto.');
      return;
    }
    if (Number.isNaN(preco) || preco < 0) {
      avisar('Atenção', 'Informe um preço válido. Ex: 39,90');
      return;
    }
    if (Number.isNaN(estoque) || estoque < 0) {
      avisar('Atenção', 'Informe a quantidade em estoque.');
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      categoria: form.categoria,
      preco,
      estoque,
      descricao: form.descricao.trim(),
    };

    setSalvando(true);
    try {
      if (editandoId) {
        await api(`/produtos/${editandoId}`, { metodo: 'PUT', corpo: dados });
        avisar('Pronto', 'Produto atualizado.');
      } else {
        await api('/produtos', { metodo: 'POST', corpo: dados });
        avisar('Pronto', 'Produto cadastrado.');
      }
      limpar();
      recarregar();
    } catch (e) {
      avisar('Erro', mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  }

  function editar(produto) {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      categoria: produto.categoria || categoriasProduto[0].nome,
      preco: String(produto.preco).replace('.', ','),
      estoque: String(produto.estoque ?? ''),
      descricao: produto.descricao || '',
    });
    rolagem.current?.scrollTo({ y: 0, animated: true });
  }

  function excluir(produto) {
    confirmar(
      'Excluir produto',
      `Deseja excluir "${produto.nome}"?`,
      async () => {
        try {
          await api(`/produtos/${produto.id}`, { metodo: 'DELETE' });
          if (editandoId === produto.id) limpar();
          recarregar();
        } catch (e) {
          avisar('Erro', mensagemErro(e));
        }
      },
      'Excluir',
      true
    );
  }

  return (
    <KeyboardAvoidingView
      style={mascara.casca}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView ref={rolagem} contentContainerStyle={mascara.conteudo} keyboardShouldPersistTaps="handled">
        <View style={mascara.formulario}>
          <Text style={mascara.titulo}>{editandoId ? 'Editar produto' : 'Novo produto'}</Text>

          <Campo
            rotulo="Nome"
            icone="tag-outline"
            placeholder="Ex: Pomada Matte Efeito Seco"
            value={form.nome}
            onChangeText={(t) => alterar('nome', t)}
          />

          <Text style={mascara.rotulo}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={mascara.categorias}>
            {categoriasProduto.map((c) => (
              <Chip
                key={c.nome}
                texto={c.nome}
                icone={c.icone}
                ativo={form.categoria === c.nome}
                onPress={() => alterar('categoria', c.nome)}
              />
            ))}
          </ScrollView>

          <View style={mascara.duasColunas}>
            <Campo
              rotulo="Preço (R$)"
              icone="cash"
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={form.preco}
              onChangeText={(t) => alterar('preco', t)}
              style={mascara.coluna}
            />
            <Campo
              rotulo="Estoque"
              icone="cube-outline"
              placeholder="0"
              keyboardType="number-pad"
              value={form.estoque}
              onChangeText={(t) => alterar('estoque', t.replace(/\D/g, ''))}
              style={mascara.coluna}
            />
          </View>

          <Campo
            rotulo="Descrição"
            icone="text"
            placeholder="Fixação, aroma, tamanho..."
            multiline
            value={form.descricao}
            onChangeText={(t) => alterar('descricao', t)}
          />

          <Botao
            titulo={editandoId ? 'Salvar alterações' : 'Cadastrar produto'}
            icone={editandoId ? 'content-save' : 'plus'}
            onPress={salvar}
            carregando={salvando}
          />
          {editandoId ? (
            <Botao titulo="Cancelar edição" tipo="contorno" icone="cancel" onPress={limpar} style={mascara.botaoSecundario} />
          ) : null}
        </View>

        <View style={mascara.cabecalhoLista}>
          <Text style={mascara.secao}>Produtos cadastrados</Text>
          <Text style={mascara.contador}>{produtos.length}</Text>
        </View>

        <Campo icone="magnify" placeholder="Buscar por nome ou categoria" value={busca} onChangeText={setBusca} />

        {carregando ? (
          <ActivityIndicator color={cores.dourado} style={mascara.indicador} />
        ) : filtrados.length === 0 ? (
          <Vazio icone="package-variant" titulo={busca ? 'Nada encontrado' : 'Nenhum produto cadastrado'} />
        ) : (
          filtrados.map((p) => (
            <View key={p.id} style={[mascara.item, editandoId === p.id && mascara.itemEditando]}>
              <View style={mascara.itemIcone}>
                <MaterialCommunityIcons name={iconeCategoria(p.categoria)} size={24} color={cores.dourado} />
              </View>
              <View style={mascara.itemInfo}>
                <Text style={mascara.itemNome} numberOfLines={1}>{p.nome}</Text>
                <Text style={mascara.itemDetalhe}>
                  {p.categoria} · {moeda(p.preco)} · {p.estoque} un.
                </Text>
              </View>
              <TouchableOpacity onPress={() => editar(p)} style={mascara.acao} hitSlop={6}>
                <MaterialCommunityIcons name="pencil" size={20} color={cores.dourado} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(p)} style={mascara.acao} hitSlop={6}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={cores.vermelho} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  formulario: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 18,
    padding: 16,
  },
  titulo: {
    color: cores.creme,
    fontFamily: fontes.titulo,
    fontSize: 22,
    marginBottom: 16,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  categorias: {
    flexGrow: 0,
    marginBottom: 14,
  },
  duasColunas: {
    flexDirection: 'row',
    gap: 12,
  },
  coluna: {
    flex: 1,
  },
  botaoSecundario: {
    marginTop: 10,
  },
  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 12,
  },
  secao: {
    color: cores.textoSecundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contador: {
    color: cores.fundo,
    backgroundColor: cores.dourado,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  indicador: {
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  itemEditando: {
    borderColor: cores.dourado,
  },
  itemIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    color: cores.creme,
    fontSize: 15,
    fontWeight: '700',
  },
  itemDetalhe: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 2,
  },
  acao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
