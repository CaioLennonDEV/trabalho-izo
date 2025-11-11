const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar banco SQLite local
const dbPath = path.join(__dirname, 'pizzaria.db');
const db = new sqlite3.Database(dbPath);

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de pizzas
  db.run(`CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tamanho TEXT NOT NULL,
    preco REAL NOT NULL
  )`);

  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    endereco TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de pedidos
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pendente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  // Tabela de itens do pedido
  db.run(`CREATE TABLE IF NOT EXISTS pedido_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    pizza_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
    FOREIGN KEY (pizza_id) REFERENCES pizzas (id)
  )`);
});

module.exports = db;