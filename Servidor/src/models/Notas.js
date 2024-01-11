const { Schema, model} = require('mongoose');

const notaSchema = new Schema ({
    contenido: {
        type: String,
        required: true,
    }
});

module.exports = model('Nota', notaSchema);