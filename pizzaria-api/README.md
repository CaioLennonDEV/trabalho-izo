# Pizzaria API

API REST para gerenciamento de pizzaria desenvolvida com Node.js, Express e PostgreSQL.

## Estrutura do Projeto

```
pizzaria-api/
│
├─ db.js
├─ index.js
├─ package.json
└─ README.md
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Configuração do Banco de Dados

### Criar tabela no PostgreSQL:
```sql
CREATE TABLE pizzas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  tamanho VARCHAR(20),
  preco DECIMAL(10,2)
);
```

### Variável de Ambiente
Configure a variável `DATABASE_URL` com a connection string do seu banco PostgreSQL.

## Execução

```bash
npm start
```

## Rotas da API

- `GET /` - Teste da API
- `GET /pizzas` - Listar todas as pizzas
- `POST /pizzas` - Criar nova pizza
- `DELETE /pizzas/:id` - Deletar pizza por ID

## Deploy no Render

1. Suba o código para o GitHub
2. Conecte o repositório no Render
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Environment Variable: `DATABASE_URL`