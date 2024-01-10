const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');





const { google } = require('googleapis');
const dayjs = require('dayjs');
const axios = require('axios');
const dotenv = require('dotenv');
const { v4: uuid } = require('uuid');


dotenv.config({});

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
})
 


//base de datos
require('./database');

//json
app.use(cors());
app.use(express.json());


//rutas
app.use('/api', require('./routes/rutas'));


app.get("/", (req, res) => {
  const htmlResponse = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejemplo HTML Response</title>
  </head>
  <body>
    <h1>Hola, mundo!</h1>
    <p>Esta es una respuesta HTML generada desde Node.js y Express.</p>
  </body>
  </html>
`;
res.send(htmlResponse)
})

//calendario
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2 (
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

app.get("/api/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    })
    
    res.redirect(url);
})

app.get("/api/google/redirect", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    res.send({
      msg: "Funciona correctamente"
    })
  } catch (error) {
    console.error('Error al obtener tokens de autorización:', error);
    res.status(500).send('Error al obtener tokens de autorización');
  }
});

app.get('/schedule_event', async (req, res) => {

  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Testeo evento2",
      description: "Testeando eventos descripcion2",
      start: {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires'
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'day').add(1, "hour").toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires'
      },
      conferenceData: {
        createRequest: {
          requestId: uuid(),
        },
      },
      attendees: [{
        email: "mati.colazo97@gmail.com"
      }]
    },
  });
  res.send({
    msg: "Listo"
  })
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});