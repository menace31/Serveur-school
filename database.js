const mongoose = require('mongoose');

const data = ''
mongoose.connect(data, {
  useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true
})
  .then(db => console.log('DB connected'))