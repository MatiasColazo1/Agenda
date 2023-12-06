const { Router } = require('express');
const router = Router();

const User = require('../models/User')

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hola mundo'));

router.post('/signup', async (req, res) => {
    const { usuario, password } = req.body; //extraer usuario y contraseña del cuerpo de la solicitud
    const newUser = new User({usuario, password}); // crear una nueva instancia del modelo usuario con el user y el password
    await newUser.save(); //guarda el nuevo usuario en la base de datos

    const token = jwt.sign({ _id: newUser._id }, 'secretKey') //Crear un token jwt para el nuevo usuario
    res.status(200).json({token}); // Enviar el token como respuesta en formato JSON
})

router.post('/signin', async (req, res) => {
    const { usuario, password } = req.body; //extraer usuario y contraseña del cuerpo de la solicitud
    const user = await User.findOne({usuario}) //buscar en un user en la base de datos con el usuario proporcionado
    if (!user) return res.status(401).send("el usuario no existe"); //verificarr si el usuario existe, si no existe mandamos el codigo 401 y el mensaje
    if (user.password !== password) return res.status(401).send("Contraseña incorrecta"); //verificar si la contraseña coincide con la almacenada

    const token = jwt.sign({_id: user._id}, 'secretKey'); //si usuario y contraseña coinciden genera un token JTW
    return res.status(200).json({token}); // reponder con el token en formato JSON 
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