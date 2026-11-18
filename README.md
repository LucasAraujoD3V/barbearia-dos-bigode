# Barbearia dos Bigode

Aplicativo mobile de barbearia feito com React Native e Expo, com uma API em Node.js (Express + Mongoose) ligada ao MongoDB Atlas.

A versão que usa Firebase (Authentication + Firestore) está no branch `firebase`.

## Telas

| Tela | Descrição |
| --- | --- |
| Login | Entrada com e-mail e senha validada na API (bcrypt + JWT) |
| Cadastro de Usuário | Cria o usuário na coleção `usuarios` do MongoDB |
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
- Node.js, Express e Mongoose
- MongoDB Atlas
- bcryptjs e jsonwebtoken
- react-native-maps
- @expo/vector-icons e fonte Playfair Display

## Como rodar

### 1. API

Copie `api/.env.example` para `api/.env` (ou para a raiz do projeto). No `.env`, troque `<db_password>` pela senha do usuário do banco e defina um `JWT_SECRET`. No MongoDB Atlas, em **Network Access**, libere o IP da máquina (ou `0.0.0.0/0` para testes).

```bash
npm run api
```

A API sobe na porta 3000. Os serviços padrão da barbearia são cadastrados automaticamente na primeira execução.

### 2. App

```bash
npm install
npx expo start
```

Abra o **Expo Go** no celular (na mesma rede Wi-Fi do computador) e leia o QR Code. O app encontra a API sozinho pelo IP do computador. Se precisar apontar para outro endereço, crie um `.env` na raiz com:

```
EXPO_PUBLIC_API_URL=http://SEU_IP:3000
```

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/cadastro` | Cria usuário e devolve o token |
| POST | `/auth/login` | Login e devolve o token |
| GET | `/auth/eu` | Dados do usuário logado |
| GET, POST | `/produtos` | Lista e cadastra produtos |
| GET, PUT, DELETE | `/produtos/:id` | Busca, altera e exclui produto |
| GET, POST | `/clientes` | Lista e cadastra clientes |
| GET, PUT, DELETE | `/clientes/:id` | Busca, altera e exclui cliente |
| GET | `/servicos` | Lista os serviços |
| GET | `/agendamentos?data=AAAA-MM-DD` | Horários reservados no dia |
| GET | `/agendamentos/meus` | Horários do usuário logado |
| POST | `/agendamentos` | Reserva um horário |
| DELETE | `/agendamentos/:id` | Cancela um horário do usuário |

Todas as rotas, menos cadastro e login, exigem o cabeçalho `Authorization: Bearer <token>`.

## Coleções do MongoDB

| Coleção | Campos |
| --- | --- |
| `usuarios` | nome, telefone, email, senha (hash) |
| `produtos` | nome, categoria, preco, estoque, descricao |
| `clientes` | nome, telefone, email, observacao |
| `servicos` | nome, descricao, preco, duracao, icone, ordem |
| `agendamentos` | data, hora, servico, preco, usuario, cliente |

## Estrutura

```
api/
  src/
    models/       Usuario, Produto, Cliente, Servico, Agendamento
    routes/       auth, produtos, clientes, servicos, agendamentos
    middlewares/  autenticar.js (JWT)
    server.js
App.js
src/
  components/   Botao, Campo, Chip, Logo, Vazio, MapaBarbearia
  context/      AuthContext.js
  data/         dados fixos da barbearia
  hooks/        useApi.js, useServicos.js
  navigation/   Rotas.js
  screens/      telas do app
  services/     api.js
  theme/        cores e fontes
  utils/        formatação e diálogos
```
