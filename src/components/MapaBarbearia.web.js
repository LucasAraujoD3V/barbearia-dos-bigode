import React from 'react';
import { View, StyleSheet } from 'react-native';
import { barbearia } from '../data/barbearia';

export default function MapaBarbearia({ style }) {
  const url = `https://www.google.com/maps?q=${barbearia.latitude},${barbearia.longitude}&z=16&output=embed`;

  return (
    <View style={[mascara.mapa, style]}>
      <iframe title={barbearia.nome} src={url} style={{ border: 0, width: '100%', height: '100%' }} loading="lazy" />
    </View>
  );
}

const mascara = StyleSheet.create({
  mapa: {
    width: '100%',
    height: '100%',
  },
});
