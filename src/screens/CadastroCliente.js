import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import Text from '../components/Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../services/api';
import useApi from '../hooks/useApi';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import Vazio from '../components/Vazio';
import { cores } from '../theme/cores';
import { telefone as mascaraTelefone, mensagemErro } from '../utils/formatar';
import { avisar, confirmar } from '../utils/dialogo';

const formularioVazio = {
  nome: '',
  telefone: '',
  email: '',
  observacao: '',
};

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function CadastroCliente() {
  const rolagem = useRef(null);
  const { dados: clientes, carregando, recarregar } = useApi('/clientes');
  const [form, setForm] = useState(formularioVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [salvando, setSalvando] = useState(false);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    const digitos = termo.replace(/\D/g, '');
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        (digitos && (c.telefone || '').replace(/\D/g, '').includes(digitos))
    );
  }, [clientes, busca]);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function limpar() {
    setForm(formularioVazio);
    setEditandoId(null);
  }

  async function salvar() {
    if (!form.nome.trim()) {
      avisar('Atenção', 'Informe o nome do cliente.');
      return;
    }
    if (form.telefone.replace(/\D/g, '').length < 10) {
      avisar('Atenção', 'Informe um telefone com DDD.');
      return;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      avisar('Atenção', 'E-mail inválido.');
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      telefone: form.telefone,
      email: form.email.trim().toLowerCase(),
      observacao: form.observacao.trim(),
    };

    setSalvando(true);
    try {
      if (editandoId) {
        await api(`/clientes/${editandoId}`, { metodo: 'PUT', corpo: dados });
        avisar('Pronto', 'Cliente atualizado.');
      } else {
        await api('/clientes', { metodo: 'POST', corpo: dados });
        avisar('Pronto', 'Cliente cadastrado.');
      }
      limpar();
      recarregar();
    } catch (e) {
      avisar('Erro', mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  }

  function editar(cliente) {
    setEditandoId(cliente.id);
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone || '',
      email: cliente.email || '',
      observacao: cliente.observacao || '',
    });
    rolagem.current?.scrollTo({ y: 0, animated: true });
  }

  function excluir(cliente) {
    confirmar(
      'Excluir cliente',
      `Deseja excluir a ficha de "${cliente.nome}"?`,
      async () => {
        try {
          await api(`/clientes/${cliente.id}`, { metodo: 'DELETE' });
          if (editandoId === cliente.id) limpar();
          recarregar();
        } catch (e) {
          avisar('Erro', mensagemErro(e));
        }
      },
      'Excluir',
      true
    );
  }

  function chamarWhatsapp(cliente) {
    const numero = (cliente.telefone || '').replace(/\D/g, '');
    if (numero) Linking.openURL(`https://wa.me/55${numero}`);
  }

  return (
    <KeyboardAvoidingView
      style={mascara.casca}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView ref={rolagem} contentContainerStyle={mascara.conteudo} keyboardShouldPersistTaps="handled">
        <View style={mascara.formulario}>
          <Text style={mascara.titulo}>{editandoId ? 'Editar cliente' : 'Novo cliente'}</Text>

          <Campo
            rotulo="Nome"
            icone="account-outline"
            placeholder="Nome do cliente"
            value={form.nome}
            onChangeText={(t) => alterar('nome', t)}
          />
          <Campo
            rotulo="Telefone"
            icone="cellphone"
            placeholder="(11) 90000-0000"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(t) => alterar('telefone', mascaraTelefone(t))}
          />
          <Campo
            rotulo="E-mail"
            icone="email-outline"
            placeholder="cliente@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => alterar('email', t)}
          />
          <Campo
            rotulo="Preferências"
            icone="mustache"
            placeholder="Ex: degradê na 1, barba na navalha, bigode aparado"
            multiline
            value={form.observacao}
            onChangeText={(t) => alterar('observacao', t)}
          />

          <Botao
            titulo={editandoId ? 'Salvar alterações' : 'Cadastrar cliente'}
            icone={editandoId ? 'content-save' : 'account-plus'}
            onPress={salvar}
            carregando={salvando}
          />
          {editandoId ? (
            <Botao titulo="Cancelar edição" tipo="contorno" icone="cancel" onPress={limpar} style={mascara.botaoSecundario} />
          ) : null}
        </View>

        <View style={mascara.cabecalhoLista}>
          <Text style={mascara.secao}>Fichas de clientes</Text>
          <Text style={mascara.contador}>{clientes.length}</Text>
        </View>

        <Campo icone="magnify" placeholder="Buscar por nome ou telefone" value={busca} onChangeText={setBusca} />

        {carregando ? (
          <ActivityIndicator color={cores.dourado} style={mascara.indicador} />
        ) : filtrados.length === 0 ? (
          <Vazio icone="account-group" titulo={busca ? 'Nada encontrado' : 'Nenhum cliente cadastrado'} />
        ) : (
          filtrados.map((c) => (
            <View key={c.id} style={[mascara.item, editandoId === c.id && mascara.itemEditando]}>
              <View style={mascara.itemTopo}>
                <View style={mascara.avatar}>
                  <Text style={mascara.avatarTexto}>{iniciais(c.nome)}</Text>
                </View>
                <View style={mascara.itemInfo}>
                  <Text style={mascara.itemNome} numberOfLines={1}>{c.nome}</Text>
                  <Text style={mascara.itemDetalhe}>{c.telefone}</Text>
                  {c.email ? <Text style={mascara.itemDetalhe} numberOfLines={1}>{c.email}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => chamarWhatsapp(c)} style={mascara.acao} hitSlop={6}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color={cores.verde} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editar(c)} style={mascara.acao} hitSlop={6}>
                  <MaterialCommunityIcons name="pencil" size={20} color={cores.dourado} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluir(c)} style={mascara.acao} hitSlop={6}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={cores.vermelho} />
                </TouchableOpacity>
              </View>
              {c.observacao ? (
                <View style={mascara.observacao}>
                  <MaterialCommunityIcons name="mustache" size={14} color={cores.douradoEscuro} />
                  <Text style={mascara.observacaoTexto}>{c.observacao}</Text>
                </View>
              ) : null}
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
    fontWeight: '800',
    letterSpacing: -0.5,
    fontSize: 22,
    marginBottom: 16,
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
  itemTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: cores.dourado,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: cores.dourado,
    fontSize: 15,
    fontWeight: '800',
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
    marginTop: 1,
  },
  acao: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  observacao: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  observacaoTexto: {
    flex: 1,
    color: cores.textoSecundario,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
