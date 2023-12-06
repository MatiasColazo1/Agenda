const express = require('express');
const app = express();
const cors = require('cors');

//base de datos
require('./database');

//json
app.use(cors());
app.use(express.json());

//rutas


app.listen(3000);
console.log('Servidor en el puerto: ', 3000)