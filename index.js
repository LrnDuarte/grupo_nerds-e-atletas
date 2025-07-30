const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurar conexão com PostgreSQL (substitua pelos seus dados)
const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rota para cadastrar membro
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
