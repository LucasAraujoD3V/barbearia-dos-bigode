import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Text from './Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

export default function Chip({ texto, icone, ativo, onPress }) {
  const cor = ativo ? cores.fundo : cores.textoSecundario;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[mascara.chip, ativo && mascara.ativo]}
    >
      {icone ? <MaterialCommunityIcons name={icone} size={16} color={cor} /> : null}
      <Text style={[mascara.texto, { color: cor }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const mascara = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    marginRight: 8,
  },
  ativo: {
    backgroundColor: cores.dourado,
    borderColor: cores.dourado,
  },
  texto: {
    fontSize: 14,
    fontWeight: '600',
  },
});
