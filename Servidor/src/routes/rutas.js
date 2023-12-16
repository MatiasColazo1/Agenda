const { Router } = require('express');
const router = Router();

const User = require('../models/User')

const jwt = require('jsonwebtoken');

const Tarjeta = require('../models/Tarjetas');

const Tarea = require('../models/Tareas');


router.get('/', (req, res) => res.send('Hola mundo'));

// -------------------- LOGIN ----------------------- //
router.post('/signin', async (req, res) => {
    const { usuario, password } = req.body; //extraer usuario y contraseña del cuerpo de la solicitud
    const user = await User.findOne({ usuario }) //buscar en un user en la base de datos con el usuario proporcionado
    if (!user) return res.status(401).send("el usuario no existe"); //verificarr si el usuario existe, si no existe mandamos el codigo 401 y el mensaje
    if (user.password !== password) return res.status(401).send("Contraseña incorrecta"); //verificar si la contraseña coincide con la almacenada

    const token = jwt.sign({ _id: user._id }, 'secretKey'); //si usuario y contraseña coinciden genera un token JTW
    return res.status(200).json({ token }); // reponder con el token en formato JSON 
})

router.post('/signup', async (req, res) => {
    const { usuario, password } = req.body; //extraer usuario y contraseña del cuerpo de la solicitud
    const newUser = new User({ usuario, password }); // crear una nueva instancia del modelo usuario con el user y el password
    await newUser.save(); //guarda el nuevo usuario en la base de datos
    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y Contraseña son obligatorios' })
    }
    const token = jwt.sign({ _id: newUser._id }, 'secretKey') //Crear un token jwt para el nuevo usuario
    res.status(200).json({ token }); // Enviar el token como respuesta en formato JSON
})

router.get('/private', verifyToken, (req, res) => {

})

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
            return res.status(400).json({message: 'Tarjeta no encontrada'});
        }
        tarjeta.titulo = titulo;
        tarjeta.descripcion = descripcion;

        await tarjeta.save();
        res.status(200).json(tarjeta);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarjeta', details: error.message})        
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
router.post('/tarea', verifyToken, async (req, res) => {
    const { titulo } = req.body;

    try {
        // Obtener el ID del usuario desde el token
        const userId = req.userUd;

        // Crear una nueva tarea
        const newTarea = new Tarea({
            titulo
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
        const { titulo } = req.body;
        const tareaId = req.params.id;

        const tarea = await Tarea.findById(tareaId);

        if (!tarea) {
            return res.status(400).json({ message: 'Tarea no encontrada' });
        }
        tarea.titulo = titulo;

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