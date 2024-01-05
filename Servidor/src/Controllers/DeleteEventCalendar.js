const EventCalendarRepository = require("../Repository/EventCalendarRepository");
const { CustomError } = require("../Error/CustomError");

// Clase para el servicio
class DeleteEventCalendarService {
  constructor(eventCalendarRepository) {
    this.eventCalendarRepository = eventCalendarRepository;
  }

  async execute(id) {
    if (!id) throw new CustomError("Event Calendar ID not provided", 400);

    const eventCalendar = await this.eventCalendarRepository.getOne(id);
    if (!eventCalendar) throw new CustomError("Event Calendar not found", 404);

    await this.eventCalendarRepository.delete(id);
    return { message: "Event Calendar deleted successfully" };
  }
}

// Clase para el controlador
class DeleteEventCalendarController {
  async handle(request, response) {
    const { id } = request.params;

    try {
      const eventCalendarRepository = new EventCalendarRepository();
      const deleteEventCalendarService = new DeleteEventCalendarService(eventCalendarRepository);
      const result = await deleteEventCalendarService.execute(id);

      return response.status(200).json(result);
    } catch (err) {
      if (err instanceof CustomError) {
        response.status(err.status).json({ message: err.message });
      } else {
        console.error(err);
        response.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}

module.exports = {
  DeleteEventCalendarService,
  DeleteEventCalendarController
};