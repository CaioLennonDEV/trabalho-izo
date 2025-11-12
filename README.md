# Pizzaria API

API REST completa para gerenciamento de pizzaria desenvolvida com Node.js, Express e PostgreSQL.

🚀 **Deploy Ativo**: https://trabalho-izo.onrender.com

## Funcionalidades

- ✅ Gerenciamento de pizzas (CRUD)
- ✅ Cadastro de usuários/clientes
- ✅ Sistema de pedidos com múltiplos itens
- ✅ Controle de status dos pedidos
- ✅ Interface web para testes
- ✅ Banco PostgreSQL com relacionamentos
- ✅ Deploy automático no Render

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

## Acesso Rápido

### 🌐 Aplicação Online
- **URL Principal**: https://trabalho-izo.onrender.com
- **Interface Web**: Acesse a URL acima para usar o sistema completo

### 🔧 Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais do PostgreSQL:
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
PORT=10000
```

4. Execute localmente:
```bash
npm start
```

## Interface Web

A interface web completa permite:
- 🍕 Cadastrar e gerenciar pizzas
- 👥 Cadastrar clientes
- 📋 Fazer pedidos com múltiplos itens
- 📊 Acompanhar status dos pedidos em tempo real
- 💰 Calcular totais automaticamente

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

✅ **Status**: Aplicação já deployada e funcionando!

### Configuração Atual
- **URL**: https://trabalho-izo.onrender.com
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Porta**: 10000 (configurada automaticamente pelo Render)
- **Banco**: PostgreSQL hospedado no Render

### Para Novos Deploys
1. Faça push das alterações para o repositório GitHub
2. O Render fará o redeploy automaticamente
3. Aguarde alguns minutos para a aplicação ficar online

### Variáveis de Ambiente Configuradas
- `DATABASE_URL`: Conexão com PostgreSQL do Render
- `PORT`: Porta definida automaticamente pelo Render