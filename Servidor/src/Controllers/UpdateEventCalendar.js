const  EventCalendarRepository  = require("../Repository/EventCalendarRepository");
const { CustomError } = require("../Error/CustomError");

// Definición de la clase del servicio
class UpdateEventCalendarService {
    constructor(eventCalendarRepository) {
        this.eventCalendarRepository = eventCalendarRepository;
    }

    async execute({ _id, title, start, end, backgroundColor, textColor }) {
        const eventCalendarUpdated = { _id, title, start, end, backgroundColor, textColor };

        try {
            if (!_id) throw new CustomError("Event Calendar not found", 400);

            const eventCalendarExist = await this.eventCalendarRepository.getOne({ _id });
            if (!eventCalendarExist) throw new CustomError("Internal server error", 400);

            for (const key in eventCalendarUpdated) {
                if (eventCalendarUpdated[key] === undefined) {
                    delete eventCalendarUpdated[key];
                }
            }

            const eventCalendar = await this.eventCalendarRepository.update(eventCalendarUpdated);
            return eventCalendar;
        } catch (err) {
            throw err;
        }
    }
}

// Clase para el controlador
class UpdateEventCalendarController {
    async handle(request, response) {
        const eventCalendar = request.body;

        try {
            const eventCalendarRepository = new EventCalendarRepository();
            const updateEventCalendarService = new UpdateEventCalendarService(eventCalendarRepository);
            const eventCalendarData = await updateEventCalendarService.execute(eventCalendar);

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

// Exportación de las clases
module.exports = {
    UpdateEventCalendarService,
    UpdateEventCalendarController
};