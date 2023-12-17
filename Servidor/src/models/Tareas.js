const { Schema, model} = require('mongoose');

const tareaSchema = new Schema ({
    titulo: String,
    completada: { type: Boolean, default: false }
});

module.exports = model('Tarea', tareaSchema);