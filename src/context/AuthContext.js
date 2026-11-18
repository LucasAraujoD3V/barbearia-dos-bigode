import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, carregarToken, salvarToken, quandoSessaoExpirar } from '../services/api';

const CHAVE_USUARIO = '@bigode:usuario';
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function guardarSessao({ token, usuario: novo }) {
    await salvarToken(token);
    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(novo));
    setUsuario(novo);
  }

  async function sair() {
    await salvarToken(null);
    await AsyncStorage.removeItem(CHAVE_USUARIO);
    setUsuario(null);
  }

  async function entrar(email, senha) {
    const resposta = await api('/auth/login', { metodo: 'POST', corpo: { email, senha } });
    await guardarSessao(resposta);
  }

  async function cadastrar(dados) {
    const resposta = await api('/auth/cadastro', { metodo: 'POST', corpo: dados });
    await guardarSessao(resposta);
  }

  useEffect(() => {
    quandoSessaoExpirar(sair);

    async function restaurar() {
      try {
        const token = await carregarToken();
        const salvo = await AsyncStorage.getItem(CHAVE_USUARIO);
        if (token && salvo) {
          setUsuario(JSON.parse(salvo));
          api('/auth/eu')
            .then((atual) => {
              setUsuario(atual);
              AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(atual));
            })
            .catch(() => {});
        }
      } finally {
        setCarregando(false);
      }
    }

    restaurar();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
