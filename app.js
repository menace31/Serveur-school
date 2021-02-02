const express = require('express');
const user = require('c:/users/home/linfo1212-master/web/models/user');

const app = express();

const server = app.listen(8080)

app.use(express.static('./public'))

// initialisation des pages et lancement de index.html

app.get('/',async(req,res) => {
  res.render('index.html');
})

app.get('/identification',async(req,res) => {
  res.render('identification.html');
})

app.post('/enregistrement' , async(req,res,done) =>{
  const {user,pwd,nom,prenom,mail} = req.body;
  const errors = [];
  const username = await user.findOne({user: user});
  

})
/* pas compris
  const newUser = new User({user,password,nom,prenom,mail});
  newUser.passport = await newUser.generatepassword(password);
  await newUser.save();
  req.flash('text', 'Welcome');
  res.redirect('/start');
  }
*/