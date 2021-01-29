const express = require('express');

const app = express();

const server = app.listen(8080)

app.use(express.static('./public'))

app.get('/',async(req,res) => {
  res.render('index.html');
})

app.get('/identification',async(req,res) => {
  res.render('identification.html');
})


/*
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app; **/