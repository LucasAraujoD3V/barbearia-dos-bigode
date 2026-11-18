import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapaBarbearia from '../components/MapaBarbearia';
import Botao from '../components/Botao';
import { barbearia, funcionamento } from '../data/barbearia';
import { cores, fontes } from '../theme/cores';

export default function Mapa() {
  const hoje = funcionamento[new Date().getDay()];
  const destino = `${barbearia.latitude},${barbearia.longitude}`;

  function tracarRota() {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destino}`);
  }

  function ligar() {
    Linking.openURL(`tel:${barbearia.telefoneLink}`);
  }

  return (
    <View style={mascara.casca}>
      <View style={mascara.mapa}>
        <MapaBarbearia />
      </View>

      <SafeAreaView edges={['bottom']} style={mascara.painel}>
        <View style={mascara.alca} />
        <Text style={mascara.nome}>{barbearia.nome}</Text>

        <View style={mascara.linha}>
          <MaterialCommunityIcons name="map-marker" size={20} color={cores.dourado} />
          <View style={mascara.linhaTextos}>
            <Text style={mascara.texto}>{barbearia.endereco}</Text>
            <Text style={mascara.textoSecundario}>{barbearia.cidade}</Text>
          </View>
        </View>

        <View style={mascara.linha}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={cores.dourado} />
          <View style={mascara.linhaTextos}>
            <Text style={mascara.texto}>
              {hoje.abre ? `Hoje: ${hoje.abre} às ${hoje.fecha}` : 'Hoje estamos fechados'}
            </Text>
            <Text style={mascara.textoSecundario}>Estacionamento conveniado na rua de trás</Text>
          </View>
        </View>

        <View style={mascara.botoes}>
          <Botao titulo="Traçar rota" icone="directions" onPress={tracarRota} style={mascara.botao} />
          <Botao titulo="Ligar" icone="phone" tipo="contorno" onPress={ligar} style={mascara.botao} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  mapa: {
    flex: 1,
  },
  painel: {
    backgroundColor: cores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    marginTop: -24,
  },
  alca: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: cores.borda,
    alignSelf: 'center',
    marginBottom: 14,
  },
  nome: {
    color: cores.creme,
    fontFamily: fontes.titulo,
    fontSize: 22,
    marginBottom: 14,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  linhaTextos: {
    flex: 1,
  },
  texto: {
    color: cores.creme,
    fontSize: 15,
    fontWeight: '600',
  },
  textoSecundario: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginTop: 2,
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  botao: {
    flex: 1,
  },
});
