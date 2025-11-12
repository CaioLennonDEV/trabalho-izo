# Como instalar PostgreSQL no Windows

## 1. Download e Instalação

1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador oficial do PostgreSQL
3. Execute o instalador como administrador
4. Durante a instalação:
   - Defina uma senha para o usuário `postgres` (anote essa senha!)
   - Mantenha a porta padrão `5432`
   - Instale todos os componentes sugeridos

## 2. Configurar o banco de dados

Após a instalação, abra o **pgAdmin** (interface gráfica) ou use o **psql** (linha de comando):

### Usando pgAdmin:
1. Abra o pgAdmin
2. Conecte com o usuário `postgres` e a senha que você definiu
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `pizzaria_db`
5. Clique em "Save"

### Usando linha de comando (psql):
```bash
# Abrir psql (pode estar em C:\Program Files\PostgreSQL\16\bin\psql.exe)
psql -U postgres

# Criar o banco
CREATE DATABASE pizzaria_db;

# Sair
\q
```

## 3. Configurar o arquivo .env

Edite o arquivo `.env` na pasta do projeto:

```env
# Configuração do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pizzaria_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI

# Porta da aplicação
PORT=3000
```

**IMPORTANTE**: Substitua `SUA_SENHA_AQUI` pela senha que você definiu durante a instalação!

## 4. Testar a conexão

Depois de configurar, execute:

```bash
npm start
```

Se tudo estiver correto, você verá:
```
PostgreSQL conectado com sucesso!
Tabelas criadas com sucesso!
Servidor rodando na porta 3000
```

## 5. Verificar se está funcionando

Teste a API:
- Abra o navegador em: http://localhost:3000
- Deve aparecer: "API da Pizzaria funcionando com PostgreSQL"

## Problemas comuns:

1. **Erro de conexão**: Verifique se o PostgreSQL está rodando (procure por "Services" no Windows e veja se "postgresql" está ativo)

2. **Senha incorreta**: Verifique se a senha no `.env` está correta

3. **Porta ocupada**: Se a porta 5432 estiver ocupada, mude no `.env` para outra porta

4. **Banco não existe**: Certifique-se de ter criado o banco `pizzaria_db`