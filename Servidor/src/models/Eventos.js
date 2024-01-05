const mongoose = require('mongoose');

const EventoSchema = mongoose.Schema( 
{
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    backgroundColor: {
      type: String,
      required: true,
    },
    textColor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "EventCalendar",
  }
);

const Evento = mongoose.model("Evento", EventoSchema);

module.exports = Evento;