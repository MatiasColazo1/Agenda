const { Router } = require('express');
const router = Router();
const moment = require('moment');

const User = require('../models/User')

const jwt = require('jsonwebtoken');

const Tarjeta = require('../models/Tarjetas');

const Tarea = require('../models/Tareas');

const Nota = require('../models/Notas');

const { CreateEventCalendarController } = require('../Controllers/CreateEventCalendar');
const { GetAllEventCalendarController } = require('../Controllers/GetAllEventCalendar');
const { GetOneEventCalendarController } = require('../Controllers/GetOneEventCalendar');
const { DeleteEventCalendarController } = require('../Controllers/DeleteEventCalendar');
const { UpdateEventCalendarController } = require('../Controllers/UpdateEventCalendar');


// -------------------- LOGIN ----------------------- //
const validateUserAndPassword = (user, password) => {
    const MIN_LENGTH = 4;
    if (user.length < MIN_LENGTH || password.length < MIN_LENGTH) {
        return 'El usuario y la contraseña deben tener al menos 4 caracteres';
    }
    // Aquí puedes añadir más validaciones si lo deseas
    return null;
};

router.post('/signin', async (req, res) => {
    const { usuario, password } = req.body;

    // Validación de usuario y contraseña
    const validationError = validateUserAndPassword(usuario, password);
    if (validationError) return res.status(400).send(validationError);

    try {
        const user = await User.findOne({ usuario });
        if (!user) return res.status(401).send("El usuario no existe");

        if (user.password !== password) return res.status(401).send("Contraseña incorrecta");

        const token = jwt.sign({ _id: user._id }, 'secretKey');
        return res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Validación de usuario y contraseña
        const validationError = validateUserAndPassword(usuario, password);
        if (validationError) return res.status(400).send(validationError);

        const existingUser = await User.findOne({ usuario });
        if (existingUser) {
            return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
        }

        const newUser = new User({ usuario, password });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, 'secretKey');
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
});

router.get('/private', verifyToken, async (req, res) => {
    try {
        const userId = req.userUd;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ usuario: user.usuario, password: user.password, colorUser: user.colorUser });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del usuario', details: error.message });
    }
});

router.put('/private', verifyToken, async (req, res) => {
    try {
        const userId = req.userUd;
        const { colorUser } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        user.colorUser = colorUser;
        await user.save();
        res.status(200).json({ usuario: user.usuario, password: user.password, colorUser: user.colorUser });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del usuario', details: error.message });
    }
});


// -------------------- Tarjetas ----------------------- //
// CREAR TARJETA
router.post('/tarjeta', verifyToken, async (req, res) => {
    const { titulo, descripcion } = req.body;

    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Crear una nueva tarjeta
        const newTarjeta = new Tarjeta({
            titulo,
            descripcion
        });

        // Guardar la tarjeta en la base de datos
        await newTarjeta.save();

        // Asociar la tarjeta al usuario
        const user = await User.findById(userId);
        user.tarjetas.push(newTarjeta);
        await user.save();

        res.status(200).json(newTarjeta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarjeta', details: error.message });
    }
});

// TRAER TARJETAS
router.get('/tarjeta', verifyToken, async (req, res) => {
    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Buscar las tarjetas asociadas al usuario
        const user = await User.findById(userId).populate('tarjetas');
        const tarjetas = user.tarjetas;

        if (!tarjetas) {
            return res.status(404).json({ message: 'Tarjetas no encontradas' });
        }

        res.status(200).json(tarjetas);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// EDITAR TARJETA
router.put('/tarjeta/:id', verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const tarjetaId = req.params.id;

        const tarjeta = await Tarjeta.findById(tarjetaId);

        if (!tarjeta) {
            return res.status(400).json({ message: 'Tarjeta no encontrada' });
        }
        tarjeta.titulo = titulo;
        tarjeta.descripcion = descripcion;

        await tarjeta.save();
        res.status(200).json(tarjeta);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarjeta', details: error.message })
    }
})

// ELIMINAR TARJETA
router.delete('/tarjeta/:id', verifyToken, async (req, res) => {
    const tarjetaId = req.params.id;

    try {
        const deleteTarjeta = await Tarjeta.findByIdAndDelete(tarjetaId);

        if (!deleteTarjeta) {
            return res.status(400).json({ message: 'Tarjeta no encontrada' });
        }

        res.status(200).json({ message: 'Tarjeta eliminada con éxito', deleteTarjeta });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la Tarjeta', details: error.message });
    }
});


// -------------------- Tareas ----------------------- //
// CREAR TAREAS
router.post('/tarea', verifyToken, async (req, res) => {
    const { titulo } = req.body;

    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Crear una nueva tarea
        const newTarea = new Tarea({
            titulo,
            completada: false // Por defecto, la tarea se crea como no completada
        });

        // Guardar la tarea en la base de datos
        await newTarea.save();

        // Asociar la tarea al usuario
        const user = await User.findById(userId);
        user.tareas.push(newTarea);
        await user.save();

        res.status(200).json(newTarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea', details: error.message });
    }
});

// TRAER TAREAS
router.get('/tarea', verifyToken, async (req, res) => {
    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Buscar las tareas asociadas al usuario
        const user = await User.findById(userId).populate('tareas');
        const tareas = user.tareas;

        if (!tareas) {
            return res.status(404).json({ message: 'Tareas no encontradas' });
        }

        res.status(200).json(tareas);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// EDITAR TAREA
router.put('/tarea/:id', verifyToken, async (req, res) => {
    try {
        const { titulo, completada } = req.body;
        const tareaId = req.params.id;

        const tarea = await Tarea.findById(tareaId);

        if (!tarea) {
            return res.status(400).json({ message: 'Tarea no encontrada' });
        }

        tarea.titulo = titulo;
        tarea.completada = completada !== undefined ? completada : tarea.completada; // Actualizar el estado de completada si se proporciona, de lo contrario, mantener el valor actual

        await tarea.save();
        res.status(200).json(tarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea', details: error.message });
    }
});

// ELIMINAR TAREA
router.delete('/tarea/:id', verifyToken, async (req, res) => {
    const tareaId = req.params.id;

    try {
        const deleteTarea = await Tarea.findByIdAndDelete(tareaId);

        if (!deleteTarea) {
            return res.status(400).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea eliminada con éxito', deleteTarea });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea', details: error.message });
    }
});

// -------------------- Notas ----------------------- //
// CREAR NOTAS
router.post('/nota', verifyToken, async (req, res) => {
    const { contenido } = req.body;

    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Crear una nueva nota
        const newNota = new Nota({
            contenido
        });

        // Guardar la nota en la base de datos
        await newNota.save();

        // Asociar la nota al usuario
        const user = await User.findById(userId);
        user.notas.push(newNota);
        await user.save();

        res.status(200).json(newNota);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la Nota', details: error.message });
    }
});

// TRAER NOTA
router.get('/nota', verifyToken, async (req, res) => {
    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Buscar las notas asociadas al usuario
        const user = await User.findById(userId).populate('notas');
        const notas = user.notas;

        if (!notas) {
            return res.status(404).json({ message: 'Notas no encontradas' });
        }

        res.status(200).json(notas);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// EDITAR NOTAS
router.put('/nota/:id', verifyToken, async (req, res) => {
    try {
        const { contenido } = req.body;
        const notaId = req.params.id;

        const nota = await Nota.findById(notaId);

        if (!nota) {
            return res.status(400).json({ message: 'Nota no encontrada' });
        }

        nota.contenido = contenido;

        await nota.save();
        res.status(200).json(nota);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la nota', details: error.message });
    }
});

// -------------------- Eventos ----------------------- //
// CREAR EVENTOS
const createEventCalendarController = new CreateEventCalendarController();
router.post("/calendario", verifyToken, (req, res) => createEventCalendarController.handle(req, res));

// TRAER EVENTOS
const getAllEventCalendarController = new GetAllEventCalendarController();
router.get('/calendario', verifyToken, (req, res) => getAllEventCalendarController.handle(req, res));

// TRAER UN EVENTO
const getOneEventCalendarController = new GetOneEventCalendarController();
router.get('/calendario/:id', verifyToken, (req, res) => getOneEventCalendarController.handle(req, res));

// ELIMINAR UN EVENTO
const deleteEventCalendarController = new DeleteEventCalendarController();
router.delete('/calendario/:id', verifyToken, (req, res) => deleteEventCalendarController.handle(req, res));

// EDITAR UN EVENTO
const updateEventCalendarController = new UpdateEventCalendarController();
router.put('/calendario', verifyToken, (req, res) => updateEventCalendarController.handle(req, res));

module.exports = router;

//rutas privadas

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