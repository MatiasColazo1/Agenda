const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    titulo: String,
    inicio: Date,
    fin: Date,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Evento', eventoSchema);