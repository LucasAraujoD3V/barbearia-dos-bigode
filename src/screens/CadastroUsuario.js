import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Logo from '../components/Logo';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { cores, fontes } from '../theme/cores';
import { mensagemErro, telefone as mascaraTelefone } from '../utils/formatar';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro('');
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }

    setCarregando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome.trim() });
      await setDoc(doc(db, 'usuarios', credencial.user.uid), {
        nome: nome.trim(),
        telefone,
        email: email.trim().toLowerCase(),
        criadoEm: serverTimestamp(),
      });
    } catch (e) {
      setErro(mensagemErro(e));
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={mascara.casca}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={mascara.conteudo} keyboardShouldPersistTaps="handled">
        <Logo tamanho={72} mostrarNome={false} />
        <Text style={mascara.titulo}>Puxe uma cadeira</Text>
        <Text style={mascara.subtitulo}>Crie sua conta para agendar horários e acompanhar a barbearia.</Text>

        <View style={mascara.formulario}>
          <Campo rotulo="Nome completo" icone="account-outline" placeholder="Seu nome" value={nome} onChangeText={setNome} />
          <Campo
            rotulo="Telefone"
            icone="cellphone"
            placeholder="(11) 90000-0000"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={(t) => setTelefone(mascaraTelefone(t))}
          />
          <Campo
            rotulo="E-mail"
            icone="email-outline"
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Campo rotulo="Senha" icone="lock-outline" placeholder="Mínimo 6 caracteres" senha value={senha} onChangeText={setSenha} />
          <Campo
            rotulo="Confirmar senha"
            icone="lock-outline"
            placeholder="Repita a senha"
            senha
            value={confirmacao}
            onChangeText={setConfirmacao}
            onSubmitEditing={cadastrar}
          />

          {erro ? <Text style={mascara.erro}>{erro}</Text> : null}

          <Botao titulo="Cadastrar" icone="account-plus" onPress={cadastrar} carregando={carregando} style={mascara.botao} />
        </View>
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
    padding: 24,
    paddingBottom: 48,
  },
  titulo: {
    color: cores.creme,
    fontFamily: fontes.titulo,
    fontSize: 26,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  formulario: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  erro: {
    color: '#E0786D',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  botao: {
    marginTop: 6,
  },
});
