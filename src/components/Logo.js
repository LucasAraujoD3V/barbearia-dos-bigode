import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

export default function Logo({ tamanho = 96, mostrarNome = true }) {
  return (
    <View style={mascara.casca}>
      <View
        style={[
          mascara.selo,
          { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
        ]}
      >
        <View
          style={[
            mascara.aro,
            { width: tamanho - 10, height: tamanho - 10, borderRadius: (tamanho - 10) / 2 },
          ]}
        >
          <MaterialCommunityIcons name="mustache" size={tamanho * 0.55} color={cores.dourado} />
        </View>
      </View>
      {mostrarNome ? (
        <View style={mascara.textos}>
          <Text style={mascara.linhaPequena}>BARBEARIA</Text>
          <Text style={mascara.nome}>dos Bigode</Text>
          <View style={mascara.filete}>
            <View style={mascara.traco} />
            <Text style={mascara.ano}>EST. 1987</Text>
            <View style={mascara.traco} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    alignItems: 'center',
  },
  selo: {
    backgroundColor: cores.superficie,
    borderWidth: 2,
    borderColor: cores.dourado,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aro: {
    borderWidth: 1,
    borderColor: cores.douradoEscuro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    alignItems: 'center',
    marginTop: 16,
  },
  linhaPequena: {
    color: cores.textoSecundario,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 6,
  },
  nome: {
    color: cores.creme,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: -2,
  },
  filete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  traco: {
    width: 28,
    height: 1,
    backgroundColor: cores.douradoEscuro,
  },
  ano: {
    color: cores.dourado,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
