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
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { cores } from '../theme/cores';

export default function Login({ navigation }) {
  const { entrar: fazerLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await fazerLogin(email.trim(), senha);
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
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

            {erro ? <Text style={mascara.erro}>{erro}</Text> : null}

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
  erro: {
    color: '#E0786D',
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
