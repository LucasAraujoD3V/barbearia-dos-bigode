import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import Logo from '../components/Logo';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { cores } from '../theme/cores';
import { mensagemErro } from '../utils/formatar';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro('');
    setAviso('');
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setErro(mensagemErro(e));
      setCarregando(false);
    }
  }

  async function esqueciSenha() {
    setErro('');
    setAviso('');
    if (!email.trim()) {
      setErro('Digite seu e-mail para receber o link de redefinição.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAviso('Enviamos um link de redefinição para o seu e-mail.');
    } catch (e) {
      setErro(mensagemErro(e));
    }
  }

  return (
    <SafeAreaView style={mascara.casca}>
      <KeyboardAvoidingView
        style={mascara.casca}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={mascara.conteudo} keyboardShouldPersistTaps="handled">
          <Logo />

          <View style={mascara.formulario}>
            <Campo
              rotulo="E-mail"
              icone="email-outline"
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
            <Campo
              rotulo="Senha"
              icone="lock-outline"
              placeholder="Sua senha"
              senha
              value={senha}
              onChangeText={setSenha}
              onSubmitEditing={entrar}
            />

            <TouchableOpacity onPress={esqueciSenha} style={mascara.esqueci}>
              <Text style={mascara.link}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {erro ? <Text style={mascara.erro}>{erro}</Text> : null}
            {aviso ? <Text style={mascara.aviso}>{aviso}</Text> : null}

            <Botao titulo="Entrar" icone="login" onPress={entrar} carregando={carregando} />

            <View style={mascara.rodape}>
              <Text style={mascara.rodapeTexto}>Primeira vez por aqui?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuario')}>
                <Text style={mascara.linkForte}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formulario: {
    marginTop: 40,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  esqueci: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  link: {
    color: cores.textoSecundario,
    fontSize: 13,
  },
  erro: {
    color: '#E0786D',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  aviso: {
    color: cores.verde,
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  rodapeTexto: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  linkForte: {
    color: cores.dourado,
    fontSize: 14,
    fontWeight: '700',
  },
});
