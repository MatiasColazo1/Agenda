const express = require('express');
const app = express();
const cors = require('cors');

//base de datos
require('./database');

//json
app.use(cors());
app.use(express.json());

//rutas
app.use('/api', require('./routes/rutas'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});