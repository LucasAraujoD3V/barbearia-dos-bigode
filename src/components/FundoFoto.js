import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../theme/cores';

const degradePadrao = ['rgba(20,17,15,0.35)', 'rgba(20,17,15,0.85)', cores.fundo];

export default function FundoFoto({ foto, degrade = degradePadrao, style, imageStyle, children }) {
  return (
    <ImageBackground
      source={{ uri: foto }}
      resizeMode="cover"
      style={[mascara.fundo, style]}
      imageStyle={imageStyle}
    >
      <LinearGradient colors={degrade} style={[StyleSheet.absoluteFill, imageStyle]} />
      {children}
    </ImageBackground>
  );
}

const mascara = StyleSheet.create({
  fundo: {
    backgroundColor: cores.superficieAlta,
    overflow: 'hidden',
  },
});
