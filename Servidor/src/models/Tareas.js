const { Schema, model} = require('mongoose');

const tareaSchema = new Schema ({
    titulo: String,
    completada: Boolean 
});

module.exports = model('Tarea', tareaSchema);