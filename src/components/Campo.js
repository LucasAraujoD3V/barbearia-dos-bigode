import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Text, { fonte } from './Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

export default function Campo({ rotulo, icone, senha, multiline, style, ...props }) {
  const [oculto, setOculto] = useState(true);
  const [focado, setFocado] = useState(false);

  return (
    <View style={[mascara.grupo, style]}>
      {rotulo ? <Text style={mascara.rotulo}>{rotulo}</Text> : null}
      <View style={[mascara.caixa, focado && mascara.caixaFocada, multiline && mascara.caixaMultilinha]}>
        {icone ? (
          <MaterialCommunityIcons
            name={icone}
            size={20}
            color={focado ? cores.dourado : cores.textoApagado}
            style={multiline ? mascara.iconeTopo : null}
          />
        ) : null}
        <TextInput
          {...props}
          multiline={multiline}
          secureTextEntry={senha && oculto}
          placeholderTextColor={cores.textoApagado}
          selectionColor={cores.dourado}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={[mascara.entrada, multiline && mascara.entradaMultilinha]}
        />
        {senha ? (
          <TouchableOpacity onPress={() => setOculto(!oculto)} hitSlop={10}>
            <MaterialCommunityIcons
              name={oculto ? 'eye-outline' : 'eye-off'}
              size={20}
              color={cores.textoSecundario}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const mascara = StyleSheet.create({
  grupo: {
    marginBottom: 14,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  caixaFocada: {
    borderColor: cores.dourado,
  },
  caixaMultilinha: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconeTopo: {
    marginTop: 2,
  },
  entrada: {
    ...fonte('400'),
    flex: 1,
    color: cores.creme,
    fontSize: 16,
    paddingVertical: 12,
  },
  entradaMultilinha: {
    minHeight: 70,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
});
