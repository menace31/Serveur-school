const express = require('express');
const path = require('path'); //me ayuda a manejar las rutas del servidor  //permet de manipuler mongo db
const passport = require('passport'); // permettre identifier un user
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const morgan = require('morgan')
const multer = require('multer') //modulo para subir imagenes
const {format} = require('timeago.js')
const socketio = require('socket.io')
const http = require('http')
const methodOverride = require("method-override");





//Init
const app = express ();
require('./database')


// server run 
const server = app.listen(8080)
const io = socketio(server).sockets;


//configurations


app.engine('html', consolidate.hogan)
app.set('views','./WEB/public')
app.set('view engine', 'ejs')

app.use(express.static('./WEB/public')) 




//middlewares
app.use(express.urlencoded({extended:false}));

const storage = multer.diskStorage({
  destination: path.join(__dirname,'/WEB/public/news/img'),
  filename: (req,file,cb,filename) =>{
    cb(null, file.originalname);
  }
});
app.use(multer({storage: storage}).single('image'));
app.use(morgan('dev'))
app.use(cookieParser('misecreto'));
app.use(bodyParser.urlencoded());
app.use(session({
    secret: 'proyecto',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
//time
app.use((req,res,next)=>{
  res.locals.text = req.flash('text');
  res.locals.msg = req.flash('msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
 
});
app.use((req,res,next)=>{
  app.locals.format = format;
  next();
  
})

//models
const Comment = require('./WEB/models/coments')
const Incident = require('./WEB/models/incidents');
const { notEqual } = require('assert');
const { Strategy, use } = require('passport');

//routes
app.get('/', checkAuthenticated,async(req,res) =>{
  const data = await Incident.find();
  res.render('index',{
    data,
    name  : req.user}
    );
});
// remder publications for user 
app.get('/user', checkAuthenticated,async(req,res) =>{
  const data = await Incident.find({autor: req.user}).sort({create_at: 'desc'});
  res.render('userfile.ejs',{
    data,
    name  : req.user}
    );
});
// contact 
app.get('/contact', checkAuthenticated,async(req,res) =>{
  res.render('contact');
})

// help

app.get('/help', checkAuthenticated,async(req,res) =>{
  const data = await Incident.find();
  res.render('help',{
    data,
    name  : req.user}
    );
})


//routesinsidents

app.get('/mail', checkAuthenticated,async(req,res) =>{
    res.render('index',{name  : req.user});
})

app.post('/mail', async(req,res) =>{
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abrahamlicorne15@gmail.com',
        pass: '9J9cH7xTh'
      }
    });

    var mailOptions = {
      from: 'abrahamlicorne15@gmail.com',
      to: 'maxime.devillet01@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info2){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info2.response);
      }


    });
    
});

app.get('/add', checkAuthenticated,async(req,res) =>{
    res.render('Page2',{name  : req.user});
})

app.post('/add', async(req,res) =>{
    const newNote = new Incident(req.body);
    newNote.filename = req.file.filename;
    newNote.path = './news/img/' + req.file.filename;
    newNote.create_at = req.file.create_at;
    newNote.autor = req.user
    await newNote.save();
    req.flash('msg','Incident add successfully')
    res.redirect('/');
    
});

app.get('/identification',(req,res) =>{
  const errors = [];
  res.render('identification',{
    errors});
})

app.post('/identification', async(req,res,done) =>{
  const {user,password,nom,prenom,mail} = req.body;
  const errors = [];
  const username =  await User.findOne({user:user});
  if (username){
    errors.push({text:"The user is already use"})
  }
  if (!user) {
    errors.push({text:"Please Write a Uset."});
  }
  if (!password) {
    errors.push({text:"Please Write a Password"});
  }
  if (password < 8){
    errors.push({text:"Invalid password. Your password must be at least 8 characters"})
  }
  if (!nom) {
    errors.push({text:"Please Write a Nom"});
  }
  if (!prenom) {
    errors.push({text:"Please Write a Prenom"});
  }
  if (!mail) {
    errors.push({text:"Please Write a E-mail"});
  }
  if (errors.length > 0) {
    console.log(errors)
    res.render("identification", {
      errors,
      user,
      mail
    });
  } else{
    const newUser = new User({user,password,nom,prenom,mail});
    newUser.passport = await newUser.generatepassword(password);
    await newUser.save();
    req.flash('text', 'Welcome');
    res.redirect('/start');
  }
});

app.get('/start', (req,res)=>{
  res.render('start')
});
//usermodel
const User = require('./WEB/models/user');
const { text } = require('body-parser');
const { send } = require('process');
const user = require('./WEB/models/user');
const { db } = require('./WEB/models/user');

//use passport
const LocalStrategy = require('passport-local').Strategy; //password

passport.use('login', new LocalStrategy({ 
    usernameField: 'user',//atraves de que dato se identifica 
  }, async (user, password, done) => {
    const errors = [];
    // Match user to User
    const check = await User.findOne({user : user});
    if (!check) {
      errors.push('Not User found.')
      return done(null, false, errors);
      
    } else {
      // match password
      const match = await User.findOne({password: password});
      if(match) {
        return done(null, user);
      } else {
        errors.push('Incorrect Password.')
        return done(null, false, errors);
      }
    }
    
  }));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
   done(null,user)
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.render('welcome')
  }


app.post('/login',passport.authenticate('login',{

    successRedirect: '/',
    failureRedirect:'/identification',
    failureFlash: true
    
}));
 //-------------- si n'est pas encore regristre envoi dans une pager pour faire loging apres avoir cree une compte 
 app.post('/start', passport.authenticate('login',{
  successRedirect: '/',
  failureRedirect:( '/identification')
}));

//logout

app.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/')
})

//deleat a cart

app.delete('/delete/:id',async(req,res) =>{
  await Incident.findByIdAndDelete(req.params.id)
  res.redirect('/user')
})

app.get('/plus/:id',checkAuthenticated, async (req,res) =>{
  const data = await Incident.findById(req.params.id)
  const comments = await Comment.find({userid:req.params.id})
  console.log(comments)
  res.render('description',{
    comments,
    data,
    name: req.user
  })
})

//add commentaire
app.post('/comment/:id', async(req,res) =>{
  const newComment = new Comment(req.body);
  newComment.autor = req.user
  newComment.userid = req.params.id
  await newComment.save();
  res.redirect('/plus/'+ req.params.id)
});


//edit a cart

app.get('/edit/:id', checkAuthenticated,async(req, res) =>{
  const cart = await Incident.findById(req.params.id)
  await Incident.findByIdAndDelete(req.params.id)
  res.render('edit',{
    cart,
    name  : req.user
  })
});


app.post('/edittrip/:id',checkAuthenticated, async(req,res) =>{
  const newNote = new Incident(req.body);
  newNote.filename = req.file.filename;
  newNote.path = './news/img/' + req.file.filename;
  newNote.create_at = req.file.create_at;
  newNote.autor = req.user
  await newNote.save();
  console.log(newNote)
  res.redirect('/user');
});

// chat websockets

io.on('connection', (socket) =>{
  var data = db.collection('data')
  socket.on('chat:message',(data) =>{
    io.emit('chat:message', data)
  })
});




// seach
app.get('/seach',async(req,res) =>{
  let search = req.query
  await Incident.find( { $text: { $search: search.search}},
  function(err,docs){
    res.render('results',{docs})
  });
});


app.get('/like',(req,res) =>{
});


//global variable

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});