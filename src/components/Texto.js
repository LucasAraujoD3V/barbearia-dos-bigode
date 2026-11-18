import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const familias = {
  normal: 'Inter_400Regular',
  100: 'Inter_400Regular',
  200: 'Inter_400Regular',
  300: 'Inter_400Regular',
  400: 'Inter_400Regular',
  500: 'Inter_500Medium',
  600: 'Inter_600SemiBold',
  700: 'Inter_700Bold',
  bold: 'Inter_700Bold',
  800: 'Inter_800ExtraBold',
  900: 'Inter_800ExtraBold',
};

export function fonte(peso = '400') {
  if (Platform.OS === 'ios') return { fontWeight: String(peso) };
  return { fontFamily: familias[String(peso)] || familias[400], fontWeight: 'normal' };
}

export default function Texto({ style, ...props }) {
  if (Platform.OS === 'ios') return <Text {...props} style={style} />;
  const plano = StyleSheet.flatten(style) || {};
  return <Text {...props} style={[style, fonte(plano.fontWeight || '400')]} />;
}
