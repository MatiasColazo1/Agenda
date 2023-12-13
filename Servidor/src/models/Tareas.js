const { Schema, model} = require('mongoose');

const tareaSchema = new Schema ({
    titulo: String
});

module.exports = model('Tarea', tareaSchema);