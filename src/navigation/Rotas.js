import React from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { cores } from '../theme/cores';
import { fonte } from '../components/Texto';

import Login from '../screens/Login';
import CadastroUsuario from '../screens/CadastroUsuario';
import Menu from '../screens/Menu';
import Horarios from '../screens/Horarios';
import Servicos from '../screens/Servicos';
import Produtos from '../screens/Produtos';
import Loja from '../screens/Loja';
import CadastroProduto from '../screens/CadastroProduto';
import CadastroCliente from '../screens/CadastroCliente';
import Mapa from '../screens/Mapa';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const cabecalho = {
  headerStyle: { backgroundColor: cores.fundo },
  headerTintColor: cores.dourado,
  headerTitleStyle: { ...fonte('700'), color: cores.creme, fontSize: 18 },
  headerShadowVisible: false,
  headerTitleAlign: 'center',
};

const iconesAbas = {
  Menu: 'view-grid',
  Horarios: 'calendar-clock',
  Servicos: 'content-cut',
  Produtos: 'package-variant',
  Loja: 'storefront-outline',
};

function Abas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...cabecalho,
        tabBarActiveTintColor: cores.dourado,
        tabBarInactiveTintColor: cores.textoApagado,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          ...(Platform.OS === 'web' ? { height: 64, paddingBottom: 8 } : null),
        },
        tabBarLabelStyle: { ...fonte('600'), fontSize: 11 },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={iconesAbas[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Menu" component={Menu} options={{ title: 'Início', headerShown: false }} />
      <Tab.Screen name="Horarios" component={Horarios} options={{ title: 'Horários' }} />
      <Tab.Screen name="Servicos" component={Servicos} options={{ title: 'Serviços' }} />
      <Tab.Screen name="Produtos" component={Produtos} options={{ title: 'Produtos' }} />
      <Tab.Screen name="Loja" component={Loja} options={{ title: 'A Loja' }} />
    </Tab.Navigator>
  );
}

export default function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={mascara.carregando}>
        <ActivityIndicator color={cores.dourado} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={cabecalho}>
      {usuario ? (
        <>
          <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
          <Stack.Screen name="CadastroProduto" component={CadastroProduto} options={{ title: 'Cadastro de Produtos' }} />
          <Stack.Screen name="CadastroCliente" component={CadastroCliente} options={{ title: 'Cadastro de Clientes' }} />
          <Stack.Screen name="Mapa" component={Mapa} options={{ title: 'Como Chegar' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} options={{ title: 'Criar Conta' }} />
        </>
      )}
    </Stack.Navigator>
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
