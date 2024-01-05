const  EventCalendarRepository  = require("../Repository/EventCalendarRepository");
const { CustomError } = require("../Error/CustomError");

// Definición de la interfaz de solicitud
class GetOneEventCalendarService {
    constructor(eventCalendarRepository) {
        this.eventCalendarRepository = eventCalendarRepository;
    }

    async execute({ id }) {
        if (!id) throw new CustomError("Id not found", 400);

        const eventCalendar = await this.eventCalendarRepository.getOne({ _id: id });

        if (!eventCalendar) throw new CustomError("Event Calendar not exist", 400);

        return eventCalendar;
    }
}

// Clase para el controlador
class GetOneEventCalendarController {
    async handle(request, response) {
        const { id } = request.params;

        try {
            const eventCalendarRepository = new EventCalendarRepository();
            const getOneEventCalendarService = new GetOneEventCalendarService(eventCalendarRepository);
            const eventCalendar = await getOneEventCalendarService.execute({ id: String(id) });

            return response.status(200).json(eventCalendar);
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
    GetOneEventCalendarService,
    GetOneEventCalendarController
};