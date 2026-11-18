import { Alert, Platform } from 'react-native';

export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

export function confirmar(titulo, mensagem, aoConfirmar, textoBotao = 'Confirmar', destrutivo = false) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoBotao, style: destrutivo ? 'destructive' : 'default', onPress: aoConfirmar },
  ]);
}
