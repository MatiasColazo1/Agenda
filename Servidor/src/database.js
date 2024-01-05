const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://maticolazo97:Z3uCB4kcccB4Iqtn@cluster0.twmgqtm.mongodb.net/?retryWrites=true&w=majority', {
     
})
    .then(db => console.log('Database conectado'))
    .catch(err => console.log(err));