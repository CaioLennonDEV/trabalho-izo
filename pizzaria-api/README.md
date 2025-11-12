# Pizzaria API

API REST completa para gerenciamento de pizzaria desenvolvida com Node.js, Express e PostgreSQL.

## Funcionalidades

- ✅ Gerenciamento de pizzas (CRUD)
- ✅ Cadastro de usuários/clientes
- ✅ Sistema de pedidos com múltiplos itens
- ✅ Controle de status dos pedidos
- ✅ Interface web para testes
- ✅ Banco PostgreSQL com relacionamentos

## Estrutura do Projeto

```
pizzaria-api/
│
├─ db.js              # Configuração do banco PostgreSQL
├─ index.js           # Servidor principal com todas as rotas
├─ .env               # Variáveis de ambiente
├─ package.json       # Dependências do projeto
├─ public/
│  └─ index.html      # Interface web para testes
└─ README.md          # Documentação
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais do PostgreSQL:
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
PORT=3000
```

## Execução

```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## Interface Web

Acesse `http://localhost:3000` para usar a interface web completa que permite:
- Cadastrar e gerenciar pizzas
- Cadastrar clientes
- Fazer pedidos
- Acompanhar status dos pedidos

## Rotas da API

### Pizzas
- `GET /pizzas` - Listar todas as pizzas
- `POST /pizzas` - Criar nova pizza
- `DELETE /pizzas/:id` - Deletar pizza

### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Cadastrar usuário
- `GET /usuarios/email/:email` - Buscar por email
- `GET /usuarios/:id/pedidos` - Pedidos de um usuário

### Pedidos
- `GET /pedidos` - Listar todos os pedidos
- `POST /pedidos` - Criar novo pedido
- `GET /pedidos/:id` - Detalhes do pedido
- `PUT /pedidos/:id/status` - Atualizar status

## Estrutura do Banco

O sistema cria automaticamente as seguintes tabelas:
- `pizzas` - Cardápio de pizzas
- `usuarios` - Clientes cadastrados
- `pedidos` - Pedidos realizados
- `pedido_itens` - Itens de cada pedido

## Deploy no Render

1. Suba o código para o GitHub
2. Conecte o repositório no Render
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Environment Variable: `DATABASE_URL`