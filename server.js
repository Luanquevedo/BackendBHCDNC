const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Rota para formulário de prestadores
app.post('/api/provider-form', async (req, res) => {
  // Aqui, criamos um novo objeto FormData e manualmente definimos o userType como 'provider'
  const formData = new FormData({
    ...req.body, // Copia os dados enviados no formulário
    userType: 'provider', // Define o tipo de usuário como 'prestador de serviço'
  });

  try {
    await formData.save(); // Salva os dados no MongoDB
    res.status(201).send('Formulário do prestador enviado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(400).send('Erro ao enviar os dados do formulário do prestador');
  }
});

// Rota para formulário de clientes
app.post('/api/client-form', async (req, res) => {
  // Aqui, criamos um novo objeto FormData e manualmente definimos o userType como 'client'
  const formData = new FormData({
    ...req.body, // Copia os dados enviados no formulário
    userType: 'client', // Define o tipo de usuário como 'cliente'
  });

  try {
    await formData.save(); // Salva os dados no MongoDB
    res.status(201).send('Formulário do cliente enviado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(400).send('Erro ao enviar os dados do formulário do cliente');
  }
});

// Rota para buscar todos os dados (independente do tipo de usuário)
app.get('/api/form', async (req, res) => {
  try {
    const allData = await FormData.find(); // Busca todos os dados no banco
    res.status(200).json(allData); // Retorna os dados como JSON
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    res.status(500).send('Erro ao buscar os dados');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
