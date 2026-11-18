import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Text from './Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

export default function Botao({ titulo, onPress, tipo = 'primario', icone, carregando, desativado, style }) {
  const corTexto = tipo === 'primario' ? cores.fundo : tipo === 'perigo' ? cores.creme : cores.dourado;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={carregando || desativado}
      style={[mascara.base, mascara[tipo], (carregando || desativado) && mascara.desativado, style]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={mascara.conteudo}>
          {icone ? <MaterialCommunityIcons name={icone} size={20} color={corTexto} /> : null}
          <Text style={[mascara.texto, { color: corTexto }]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const mascara = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primario: {
    backgroundColor: cores.dourado,
  },
  contorno: {
    borderWidth: 1.5,
    borderColor: cores.dourado,
    backgroundColor: 'transparent',
  },
  perigo: {
    backgroundColor: cores.vermelho,
  },
  desativado: {
    opacity: 0.5,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
