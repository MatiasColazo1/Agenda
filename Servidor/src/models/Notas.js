const { Schema, model} = require('mongoose');

const notaSchema = new Schema ({
    contenido: {
        type: String
    }
});

module.exports = model('Nota', notaSchema);