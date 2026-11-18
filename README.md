# Barbearia dos Bigode

Aplicativo mobile de barbearia feito com React Native, Expo e Firebase (Authentication + Cloud Firestore).

## Telas

| Tela | Descrição |
| --- | --- |
| Login | Entrada com e-mail e senha pelo Firebase Authentication |
| Cadastro de Usuário | Cria a conta no Authentication e salva o perfil na coleção `usuarios` |
| Menu (tabs) | Navegação inferior: Início, Horários, Serviços, Produtos e A Loja |
| Menu (grid) | Tela inicial com os atalhos em grade e o próximo horário do usuário |
| Cadastro de Produto | CRUD completo na coleção `produtos` |
| Cadastro de Cliente | CRUD completo na coleção `clientes` |
| Horários | Funcionamento da semana e grade de horários com reserva e cancelamento |
| Produtos | Vitrine dos produtos com filtro por categoria |
| Serviços | Lista de serviços com preço, duração e botão para agendar |
| Localização | Mapa com o endereço, rota pelo Google Maps e botão de ligar |
| A Loja | História, equipe, diferenciais, horários e contatos |

## Tecnologias

- Expo SDK 58 / React Native
- React Navigation (Native Stack + Bottom Tabs)
- Firebase Authentication e Cloud Firestore
- react-native-maps
- @expo/vector-icons e fonte Playfair Display

## Como rodar

```bash
npm install
npx expo start
```

Abra o app **Expo Go** no celular e leia o QR Code. Para rodar no navegador: `npx expo start --web`.

## Configurando o Firebase

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com).
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Firestore Database**, crie o banco e cole o conteúdo de `firestore.rules` na aba **Regras**.
4. Em **Configurações do projeto > Seus apps**, adicione um app **Web** e copie o `firebaseConfig`.
5. Cole os valores em `src/config/firebase.js`.

Os serviços padrão da barbearia são gravados automaticamente no Firestore no primeiro acesso.

## Coleções do Firestore

| Coleção | Campos |
| --- | --- |
| `usuarios` | nome, telefone, email, criadoEm |
| `produtos` | nome, categoria, preco, estoque, descricao |
| `clientes` | nome, telefone, email, observacao |
| `servicos` | nome, descricao, preco, duracao, icone, ordem |
| `agendamentos` | data, hora, servico, preco, usuarioId, cliente |

## Estrutura

```
App.js
src/
  components/   Botao, Campo, Chip, Logo, Vazio, MapaBarbearia
  config/       firebase.js
  context/      AuthContext.js
  data/         dados fixos da barbearia
  hooks/        useServicos.js
  navigation/   Rotas.js
  screens/      telas do app
  theme/        cores e fontes
  utils/        formatação e diálogos
```
