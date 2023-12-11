const { Schema, model} = require('mongoose');

const tarjetaSchema = new Schema ({
    titulo: String,
    descripcion: String
});

module.exports = model('Tarjeta', tarjetaSchema);