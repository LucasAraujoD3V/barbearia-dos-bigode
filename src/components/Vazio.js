import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

export default function Vazio({ icone = 'mustache', titulo, texto }) {
  return (
    <View style={mascara.casca}>
      <MaterialCommunityIcons name={icone} size={48} color={cores.borda} />
      <Text style={mascara.titulo}>{titulo}</Text>
      {texto ? <Text style={mascara.texto}>{texto}</Text> : null}
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  titulo: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
