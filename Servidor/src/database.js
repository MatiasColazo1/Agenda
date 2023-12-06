const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notas-mean', {
     
})
    .then(db => console.log('Database conectado'))
    .catch(err => console.log(err));