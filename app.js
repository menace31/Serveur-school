const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose')

const app = express();

app.use(bodyParser.urlencoded());

const Mongo_URL = 'mongodb+srv://DevilletMaxime:278EOZ31@cluster0.iwfqt.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(Mongo_URL, {
  useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: false
})

mongoose.connection.on('connected',() => {
  console.log("Mongo is connected")
})

const Schema = mongoose.Schema;

const userSchema = new Schema({

  password: {type:String},
  nom: {type:String},
  prenom: {type:String},
  mail: {type:String},
});

const userModel = mongoose.model('user', userSchema);



const server = app.listen(8080)

app.use(express.static('./public'))

// initialisation des pages et lancement de index.html

app.get('/',async(req,res) => {
  res.render('index.html');
})

app.post('/identification',async(req,res) => {
  console.log('hey ça marche');
})

app.post('/enregistrement' , async(req,res,done) =>{
  console.log('hey ça marche');
  const {nom,prenom,mail,pwd} = req.body;
 console.log(pwd)
  const newUser = new userModel({pwd,nom,prenom,mail});

  newUser.save((error) => {
    if (error){
      console.log(error)
    }
    else{
      console.log('Data has been saved')
    }
  })

})