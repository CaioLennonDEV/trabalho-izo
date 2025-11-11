const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db-sqlite");

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Teste de conexão
console.log("Banco SQLite conectado com sucesso!");

// Rota inicial
app.get("/", (req, res) => {
  res.send("API da Pizzaria funcionando");
});

// Criar pizza
app.post("/pizzas", (req, res) => {
  const { nome, tamanho, preco } = req.body;
  
  db.run(
    "INSERT INTO pizzas (nome, tamanho, preco) VALUES (?, ?, ?)",
    [nome, tamanho, preco],
    function(err) {
      if (err) {
        res.status(500).json({ erro: err.message });
        return;
      }
      
      // Buscar a pizza criada
      db.get("SELECT * FROM pizzas WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ erro: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Listar pizzas
app.get("/pizzas", (req, res) => {
  db.all("SELECT * FROM pizzas", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// Deletar pizza
app.delete("/pizzas/:id", (req, res) => {
  const { id } = req.params;
  
  db.run("DELETE FROM pizzas WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json({ mensagem: "Pizza removida", changes: this.changes });
  });
});

// ========== ROTAS DE USUÁRIOS ==========

// Criar usuário
app.post("/usuarios", (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  
  db.run(
    "INSERT INTO usuarios (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)",
    [nome, email, telefone, endereco],
    function(err) {
      if (err) {
        res.status(500).json({ erro: err.message });
        return;
      }
      
      db.get("SELECT * FROM usuarios WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ erro: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Listar usuários
app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// Buscar usuário por email
app.get("/usuarios/email/:email", (req, res) => {
  const { email } = req.params;
  
  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ erro: "Usuário não encontrado" });
      return;
    }
    res.json(row);
  });
});

// ========== ROTAS DE PEDIDOS ==========

// Criar pedido
app.post("/pedidos", (req, res) => {
  const { usuario_id, itens } = req.body; // itens = [{pizza_id, quantidade}]
  
  // Calcular total
  let total = 0;
  let processedItems = 0;
  const itemsWithPrice = [];
  
  itens.forEach(item => {
    db.get("SELECT preco FROM pizzas WHERE id = ?", [item.pizza_id], (err, pizza) => {
      if (err) {
        res.status(500).json({ erro: err.message });
        return;
      }
      
      const precoUnitario = pizza.preco;
      const subtotal = precoUnitario * item.quantidade;
      total += subtotal;
      
      itemsWithPrice.push({
        pizza_id: item.pizza_id,
        quantidade: item.quantidade,
        preco_unitario: precoUnitario
      });
      
      processedItems++;
      
      // Quando todos os itens foram processados
      if (processedItems === itens.length) {
        // Criar pedido
        db.run(
          "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)",
          [usuario_id, total],
          function(err) {
            if (err) {
              res.status(500).json({ erro: err.message });
              return;
            }
            
            const pedidoId = this.lastID;
            
            // Inserir itens do pedido
            itemsWithPrice.forEach(item => {
              db.run(
                "INSERT INTO pedido_itens (pedido_id, pizza_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
                [pedidoId, item.pizza_id, item.quantidade, item.preco_unitario]
              );
            });
            
            res.json({ id: pedidoId, usuario_id, total, status: 'pendente' });
          }
        );
      }
    });
  });
});

// Listar pedidos
app.get("/pedidos", (req, res) => {
  const query = `
    SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// Pedidos de um usuário
app.get("/usuarios/:id/pedidos", (req, res) => {
  const { id } = req.params;
  
  db.all("SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// Detalhes do pedido com itens
app.get("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.*,
      u.nome as usuario_nome,
      u.email as usuario_email,
      u.telefone as usuario_telefone,
      u.endereco as usuario_endereco
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.id = ?
  `;
  
  db.get(query, [id], (err, pedido) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    
    if (!pedido) {
      res.status(404).json({ erro: "Pedido não encontrado" });
      return;
    }
    
    // Buscar itens do pedido
    const itemsQuery = `
      SELECT 
        pi.*,
        pz.nome as pizza_nome,
        pz.tamanho as pizza_tamanho
      FROM pedido_itens pi
      JOIN pizzas pz ON pi.pizza_id = pz.id
      WHERE pi.pedido_id = ?
    `;
    
    db.all(itemsQuery, [id], (err, itens) => {
      if (err) {
        res.status(500).json({ erro: err.message });
        return;
      }
      
      pedido.itens = itens;
      res.json(pedido);
    });
  });
});

// Atualizar status do pedido
app.put("/pedidos/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run("UPDATE pedidos SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json({ mensagem: "Status atualizado", changes: this.changes });
  });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));