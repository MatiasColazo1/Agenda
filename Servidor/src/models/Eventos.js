const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    start: Date,
    end: Date,
    title: String
});

module.exports = mongoose.model('Evento', eventoSchema);