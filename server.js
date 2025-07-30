const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do CORS para aceitar requisições do frontend
app.use(cors());

// Middleware para ler JSON no corpo da requisição
app.use(bodyParser.json());

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
  user: 'seu_usuario',        // substitua
  host: 'localhost',
  database: 'seu_banco',      // substitua
  password: 'sua_senha',      // substitua
  port: 5432,
});

// Rota para cadastro do membro
app.post('/api/membros', async (req, res) => {
  const { nome, email, sexo, idade, anoGraduacao, area } = req.body;

  if (!nome || !email || !sexo || !idade || !anoGraduacao || !area) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const query = `
      INSERT INTO membros (nome, email, sexo, idade, ano_graduacao, area)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [nome, email, sexo, idade, anoGraduacao, area];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Membro cadastrado com sucesso!', membro: result.rows[0] });
  } catch (error) {
    console.error('Erro ao inserir no banco:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
