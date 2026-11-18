import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import Rotas from './src/navigation/Rotas';
import { cores } from './src/theme/cores';

const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.dourado,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.creme,
    border: cores.borda,
    notification: cores.vermelho,
  },
};

export default function App() {
  const [fontesProntas] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontesProntas) {
    return (
      <View style={mascara.carregando}>
        <ActivityIndicator color={cores.dourado} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={tema}>
          <StatusBar style="light" />
          <Rotas />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const mascara = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
