const EventCalendarRepository  = require("../Repository/EventCalendarRepository");
const { CustomError } = require("../Error/CustomError"); 

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
  
      try {
        const eventCalendarRepository = new EventCalendarRepository();
        const createEventCalendarService = new CreateEventCalendarService(eventCalendarRepository);
        const eventCalendarData = await createEventCalendarService.execute(eventCalendar);
  
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