const { Schema,model } = require('mongoose');

const user = new Schema({
    user: {type:String, required: true, unique: true},
    password: {type:String,required: true},
    nom: {type:String,required: true},
    prenom: {type:String,required: true},
    mail: {type:String,required: true},
});

module.exports = model('User',user);