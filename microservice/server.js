const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/auth_service', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
  
const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Vérification si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' });
      }
  
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Création d'un nouvel utilisateur
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
      res.status(500).json({ message: 'Erreur lors de la création du compte' });
    }
  });
  
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Recherche de l'utilisateur dans la bdd
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
  
      // Vérification du mdp
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
  
      // Création du JWT
      const token = jwt.sign({ userId: user._id }, 'secretKey');
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  });
  
  
  
