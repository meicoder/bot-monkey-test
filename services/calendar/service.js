const { google } = require('googleapis');
const googleCalendarConfig = require('./config');

// Utiliza la clave de la cuenta de servicio para la autenticación
const clientAuth = new google.auth.GoogleAuth({
    keyFile: googleCalendarConfig.keyFilename,
    scopes: [process.env.GOOGLE_CALENDAR_SCOPES]
});

const calendar = google.calendar({ version: 'v3', clientAuth });

module.exports = {
    calendar,
    clientAuth
};
