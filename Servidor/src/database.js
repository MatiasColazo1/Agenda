require('dotenv').config();
const mongoose = require('mongoose');


//Mongo Atlas deploy
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.twmgqtm.mongodb.net/?retryWrites=true&w=majority`)
   .then(db => console.log('Database conectado'))
   .catch(err => console.log(err));