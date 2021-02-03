const mongoose = require('mongoose');

const data = 'mongodb+srv://DevilletMaxime:<278EOZ31>@cluster0.iwfqt.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(data, {
  useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true
})
  .then(db => console.log('DB connected'))