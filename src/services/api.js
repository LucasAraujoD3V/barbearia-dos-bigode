import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function enderecoDaApi() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host || 'localhost'}:3000`;
}

export const API_URL = enderecoDaApi().replace(/\/$/, '');

const CHAVE_TOKEN = '@bigode:token';
let token = null;
let aoExpirar = null;

export async function carregarToken() {
  token = await AsyncStorage.getItem(CHAVE_TOKEN);
  return token;
}

export async function salvarToken(novo) {
  token = novo;
  if (novo) await AsyncStorage.setItem(CHAVE_TOKEN, novo);
  else await AsyncStorage.removeItem(CHAVE_TOKEN);
}

export function quandoSessaoExpirar(funcao) {
  aoExpirar = funcao;
}

export async function api(caminho, { metodo = 'GET', corpo } = {}) {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 15000);
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      signal: controle.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (e) {
    throw new Error(`Sem conexão com a API (${API_URL}). Confira se ela está rodando.`);
  } finally {
    clearTimeout(limite);
  }

  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    if (resposta.status === 401 && token && aoExpirar) aoExpirar();
    const erro = new Error(dados.erro || 'Algo deu errado.');
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
