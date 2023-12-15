const { Router } = require('express');
const router = Router();

const User = require('../models/User')

const jwt = require('jsonwebtoken');

const Tarjeta = require('../models/Tarjetas');

const Tarea = require('../models/Tareas');

const passport = require('passport');

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
router.post('/tarjeta', async (req, res) => {
    const { titulo, descripcion } = req.body;
    const newTarjeta = new Tarjeta ({
        titulo,
        descripcion
    });
    await newTarjeta.save();
    res.status(200).json(newTarjeta);
});

// TRAER TARJETAS
router.get('/tarjeta', async (req, res) => {
    try {
        const tarjeta = await Tarjeta.find({}); // Realiza una busqueda para obtener la tarjeta

        if(!tarjeta){
            return res.status(404).json({message: 'Tarjeta no encontrada'})
        }
        res.status(200).json(tarjeta)
    } catch (error) {
        return res.status(500).json({message: 'Error interno del servidor'});
    }
})

// EDITAR TARJETA
router.put('/tarjeta/:id', async (req, res) => {
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
router.delete('/tarjeta/:id', async (req, res) => {
    const tarjetaId = req.params.id;

    try {
        const deleteTarjeta = await Tarjeta.findByIdAndDelete(tarjetaId);

        if (!deleteTarjeta) {
            return res.status(400).json({message: 'Tarjeta no encontrada'});
        }

        res.status(200).json({message: 'Tarjeta eliminada con exito', deleteTarjeta});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar la tarjeta', details: error.message})
    }
})

// -------------------- Tareas ----------------------- //
// CREAR TAREA
router.post('/tarea', async (req, res) => {
    const { titulo } = req.body;
    const newTarea = new Tarea ({
        titulo,
    });
    await newTarea.save();
    res.status(200).json(newTarea);
});

// TRAER TAREAS
router.get('/tarea', async (req, res) => {
    try {
        const tarea = await Tarea.find({}); // Realiza una busqueda para obtener la tarjeta

        if(!tarea){
            return res.status(404).json({message: 'Tarea no encontrada'})
        }
        res.status(200).json(tarea)
    } catch (error) {
        return res.status(500).json({message: 'Error interno del servidor'});
    }
})

// EDITAR TARJETA
router.put('/tarea/:id', async (req, res) => {
    try {
        const { titulo} = req.body;
        const tareaId = req.params.id;

        const tarea = await Tarea.findById(tareaId);

        if (!tarea) {
            return res.status(400).json({message: 'Tarea no encontrada'});
        }
        tarea.titulo = titulo;

        await tarea.save();
        res.status(200).json(tarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea', details: error.message})        
    }
})

// ELIMINAR TARJETA
router.delete('/tarea/:id', async (req, res) => {
    const tareaId = req.params.id;

    try {
        const deleteTarea = await Tarea.findByIdAndDelete(tareaId);

        if (!deleteTarea) {
            return res.status(400).json({message: 'Tarea no encontrada'});
        }

        res.status(200).json({message: 'Tarea eliminada con exito', deleteTarea});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar la tarea', details: error.message})
    }
})


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