const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();


app.use(bodyParser.json());

  const axios = require('axios');

  app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Appel du microservice d'authentification pour la création de compte
      const response = await axios.post('http://localhost:3000/register', { username, password });
  
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
      res.status(500).json({ message: 'Erreur lors de la création du compte' });
    }
  });
  
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Appel du microservice d'authentification pour la connexion
      const response = await axios.post('http://localhost:3000/login', { username, password });
  
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  });
  