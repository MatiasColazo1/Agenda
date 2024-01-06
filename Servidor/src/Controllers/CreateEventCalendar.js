const EventCalendarRepository  = require("../Repository/EventCalendarRepository");
const { CustomError } = require("../Error/CustomError"); 
const User = require('../models/User')

// Clase para el servicio
class CreateEventCalendarService {
    constructor(eventCalendarRepository) {
      this.eventCalendarRepository = eventCalendarRepository;
    }
  
    async execute(data) {
      if (!data) throw new CustomError("Event Calendar not found", 400);
  
      const eventCalendar = await this.eventCalendarRepository.create(data);
      if (!eventCalendar) throw new CustomError("Internal server error", 500);
  
      return eventCalendar;
    }
  }
  
  // Clase para el controlador
  class CreateEventCalendarController {
    async handle(request, response) {
      const eventCalendar = request.body;
      const userId = request.userUd;
  
      try {
        const eventCalendarRepository = new EventCalendarRepository();
        const createEventCalendarService = new CreateEventCalendarService(eventCalendarRepository);
        const eventCalendarData = await createEventCalendarService.execute(eventCalendar, userId);
  
        return response.status(201).json(eventCalendarData);
      } catch (err) {
        if (err instanceof CustomError) {
          response.status(err.status).json({ message: err.message });
        } else {
          // Manejo de otros tipos de errores
          console.error(err);
          response.status(500).json({ message: "An unexpected error occurred" });
        }
      }
    }
  }

  module.exports = {
    CreateEventCalendarService,
    CreateEventCalendarController
};

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
      return res.status(401).send('No autorizado'); // verificamos si se proporciona en encabezado de autorizacion en la solicitud, si no hay responde con codigo 401
  }

  // extraer el token del encabezado de autorizacion
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === 'null') {
      return res.status(401).send('No autorizado'); //si el token es nulo responde con 401 y mensaje
  }

  const payload = jwt.verify(token, 'secretKey') //verifica el token utilzando la clae secreta
  req.userUd = payload._id; // Almacenar el ID del usuario en la solicitud para su uso en las rutas protegidas
  next(); // Para continuar con el siguiente middleware o controlador
}