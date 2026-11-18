import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { barbearia } from '../data/barbearia';
import { cores } from '../theme/cores';

export default function MapaBarbearia({ style }) {
  const regiao = {
    latitude: barbearia.latitude,
    longitude: barbearia.longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006,
  };

  return (
    <MapView style={[mascara.mapa, style]} initialRegion={regiao} userInterfaceStyle="dark">
      <Marker
        coordinate={{ latitude: barbearia.latitude, longitude: barbearia.longitude }}
        title={barbearia.nome}
        description={barbearia.endereco}
        pinColor={cores.dourado}
      />
    </MapView>
  );
}

const mascara = StyleSheet.create({
  mapa: {
    width: '100%',
    height: '100%',
  },
});
