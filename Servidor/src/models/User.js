const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  usuario: String,
  password: String,
  tarjetas: [{ type: Schema.Types.ObjectId, ref: 'Tarjeta' }],
  tareas: [{ type: Schema.Types.ObjectId, ref: 'Tarea' }],
  notas: [{ type: Schema.Types.ObjectId, ref: 'Nota' }],
  eventos: [{ type: Schema.Types.ObjectId, ref: 'Evento' }],
  colorUser: String,
}, {
  timestamps: true
});

module.exports = model('User', userSchema);