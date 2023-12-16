const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  usuario: String,
  password: String,
  tarjetas: [{ type: Schema.Types.ObjectId, ref: 'Tarjeta' }],
  tareas: [{ type: Schema.Types.ObjectId, ref: 'Tarea' }]
}, {
  timestamps: true
});

module.exports = model('User', userSchema);