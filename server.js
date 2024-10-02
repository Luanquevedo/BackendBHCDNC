const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FormData = require('./models/formData'); // Importando o modelo

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.post('/api/form', async (req, res) => {
    const formData = new FormData(req.body); 
  try {
    await formData.save(); // Salva os dados no MongoDB
    res.status(201).send('Formulário enviado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(400).send('Erro ao enviar os dados do formulário');
  }
});

app.get('/api/form', async (req, res) => {
    try {
      const allData = await FormData.find(); // Busca todos os dados
      res.status(200).json(allData); // Retorna os dados como JSON
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
      res.status(500).send('Erro ao buscar os dados');
    }
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
