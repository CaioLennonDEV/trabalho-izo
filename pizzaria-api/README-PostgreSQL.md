# Pizzaria API - PostgreSQL

Esta API foi migrada do SQLite para PostgreSQL mantendo todas as funcionalidades.

## Configuração do PostgreSQL

### 1. Instalar PostgreSQL
- Windows: Baixe do site oficial postgresql.org
- macOS: `brew install postgresql`
- Linux: `sudo apt-get install postgresql postgresql-contrib`

### 2. Configurar o banco de dados

```sql
-- Conectar como superusuário postgres
sudo -u postgres psql

-- Criar banco de dados
CREATE DATABASE pizzaria_db;

-- Criar usuário (opcional)
CREATE USER pizzaria_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE pizzaria_db TO pizzaria_user;

-- Sair
\q
```

### 3. Configurar variáveis de ambiente

Edite o arquivo `.env` com suas configurações:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pizzaria_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3000
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Executar a aplicação

```bash
npm start
# ou para desenvolvimento
npm run dev
```

## Principais mudanças do SQLite para PostgreSQL

1. **Driver**: Substituído `sqlite3` por `pg`
2. **Sintaxe SQL**: 
   - `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
   - `REAL` → `DECIMAL(10,2)`
   - `TEXT` → `VARCHAR(255)` ou `TEXT`
   - Placeholders `?` → `$1, $2, $3...`
3. **Async/Await**: Todas as operações agora são assíncronas
4. **Transações**: Implementadas para operações complexas como criação de pedidos
5. **Pool de conexões**: Melhor performance e gerenciamento de conexões

## Endpoints da API

### Pizzas
- `GET /pizzas` - Listar pizzas
- `POST /pizzas` - Criar pizza
- `DELETE /pizzas/:id` - Deletar pizza

### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário
- `GET /usuarios/email/:email` - Buscar por email

### Pedidos
- `GET /pedidos` - Listar pedidos
- `POST /pedidos` - Criar pedido
- `GET /pedidos/:id` - Detalhes do pedido
- `GET /usuarios/:id/pedidos` - Pedidos de um usuário
- `PUT /pedidos/:id/status` - Atualizar status

## Exemplo de uso

```javascript
// Criar pizza
POST /pizzas
{
  "nome": "Margherita",
  "tamanho": "Grande",
  "preco": 35.90
}

// Criar usuário
POST /usuarios
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123"
}

// Criar pedido
POST /pedidos
{
  "usuario_id": 1,
  "itens": [
    {"pizza_id": 1, "quantidade": 2},
    {"pizza_id": 2, "quantidade": 1}
  ]
}
```