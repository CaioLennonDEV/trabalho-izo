const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool, createTables } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Teste de conexão e criação de tabelas
const initializeDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log("PostgreSQL conectado com sucesso!");
    await createTables();
  } catch (err) {
    console.error("Erro ao conectar com PostgreSQL:", err.message);
    console.log("Verifique se o PostgreSQL está rodando e as configurações no .env estão corretas");
    console.log("A API continuará rodando, mas as operações de banco falharão até a conexão ser estabelecida");
  }
};

initializeDatabase();

// Rota inicial
app.get("/", (req, res) => {
  res.send("API da Pizzaria funcionando com PostgreSQL");
});

// Criar pizza
app.post("/pizzas", async (req, res) => {
  const { nome, tamanho, preco } = req.body;
  
  try {
    const result = await pool.query(
      "INSERT INTO pizzas (nome, tamanho, preco) VALUES ($1, $2, $3) RETURNING *",
      [nome, tamanho, preco]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar pizzas
app.get("/pizzas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pizzas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar pizza
app.delete("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query("DELETE FROM pizzas WHERE id = $1", [id]);
    res.json({ mensagem: "Pizza removida", changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ========== ROTAS DE USUÁRIOS ==========

// Criar usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, telefone, endereco]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar usuários
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar usuário por email
app.get("/usuarios/email/:email", async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      res.status(404).json({ erro: "Usuário não encontrado" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ========== ROTAS DE PEDIDOS ==========

// Criar pedido
app.post("/pedidos", async (req, res) => {
  const { usuario_id, itens } = req.body; // itens = [{pizza_id, quantidade}]
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Calcular total
    let total = 0;
    const itemsWithPrice = [];
    
    for (const item of itens) {
      const pizzaResult = await client.query("SELECT preco FROM pizzas WHERE id = $1", [item.pizza_id]);
      const precoUnitario = parseFloat(pizzaResult.rows[0].preco);
      const subtotal = precoUnitario * item.quantidade;
      total += subtotal;
      
      itemsWithPrice.push({
        pizza_id: item.pizza_id,
        quantidade: item.quantidade,
        preco_unitario: precoUnitario
      });
    }
    
    // Criar pedido
    const pedidoResult = await client.query(
      "INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING *",
      [usuario_id, total]
    );
    
    const pedidoId = pedidoResult.rows[0].id;
    
    // Inserir itens do pedido
    for (const item of itemsWithPrice) {
      await client.query(
        "INSERT INTO pedido_itens (pedido_id, pizza_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)",
        [pedidoId, item.pizza_id, item.quantidade, item.preco_unitario]
      );
    }
    
    await client.query('COMMIT');
    res.json({ id: pedidoId, usuario_id, total, status: 'pendente' });
    
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// Listar pedidos
app.get("/pedidos", async (req, res) => {
  const query = `
    SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Pedidos de um usuário
app.get("/usuarios/:id/pedidos", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query("SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY created_at DESC", [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Detalhes do pedido com itens
app.get("/pedidos/:id", async (req, res) => {
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
    WHERE p.id = $1
  `;
  
  try {
    const pedidoResult = await pool.query(query, [id]);
    
    if (pedidoResult.rows.length === 0) {
      res.status(404).json({ erro: "Pedido não encontrado" });
      return;
    }
    
    const pedido = pedidoResult.rows[0];
    
    // Buscar itens do pedido
    const itemsQuery = `
      SELECT 
        pi.*,
        pz.nome as pizza_nome,
        pz.tamanho as pizza_tamanho
      FROM pedido_itens pi
      JOIN pizzas pz ON pi.pizza_id = pz.id
      WHERE pi.pedido_id = $1
    `;
    
    const itensResult = await pool.query(itemsQuery, [id]);
    pedido.itens = itensResult.rows;
    
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar status do pedido
app.put("/pedidos/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await pool.query("UPDATE pedidos SET status = $1 WHERE id = $2", [status, id]);
    res.json({ mensagem: "Status atualizado", changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));