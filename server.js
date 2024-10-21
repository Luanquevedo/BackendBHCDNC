// server.js
require('dotenv').config(); // Carrega variáveis de ambiente
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Para criar tokens JWT
const FormData = require('./models/formData'); // Importando o modelo

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());


// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Verifica se o usuário e a senha correspondem às variáveis de ambiente
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Usuário ou senha inválidos' });
});

// Middleware para proteger rotas
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401); // Não autorizado

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Proibido
    req.user = user;
    next();
  });
};

// Rota do Painel Administrativo
app.get('/api/admin', authenticateJWT, async (req, res) => {
  try {
    const allData = await FormData.find(); // Busca todos os dados no banco
    res.status(200).json(allData); // Retorna os dados como JSON
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    res.status(500).send('Erro ao buscar os dados');
  }
});

// Rota para formulário de prestadores
app.post('/api/provider-form', async (req, res) => {
  const formData = new FormData({
    ...req.body,
    userType: 'provider',
  });

  try {
    await formData.save();
    res.status(201).send('Formulário do prestador enviado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(400).send('Erro ao enviar os dados do formulário do prestador');
  }
});

// Rota para formulário de clientes
app.post('/api/client-form', async (req, res) => {
  const formData = new FormData({
    ...req.body,
    userType: 'client',
  });

  try {
    await formData.save();
    res.status(201).send('Formulário do cliente enviado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(400).send('Erro ao enviar os dados do formulário do cliente');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
