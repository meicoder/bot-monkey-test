const moment = require("moment-timezone");
moment.locale("es");

const getCustomerWAID = (remoteJid) => {
    const atIndex = remoteJid.indexOf("@");
    return remoteJid.substring(0, atIndex);
};

const getNextDayDate = (inputDay) => {
    // Create a moment object for the current date
    const currentDate = moment().tz("America/La_Paz");

    // Define an object that maps day names to their numerical representation
    const dayMap = {
        DOMINGO: 0,
        LUNES: 1,
        MARTES: 2,
        MIERCOLES: 3,
        JUEVES: 4,
        VIERNES: 5,
        SABADO: 6,
    };

    // Get the numerical representation of the input day
    const inputDayIndex = dayMap[inputDay];

    // Calculate the difference between the input day and the current day of the week
    let dayDifference = inputDayIndex - currentDate.day();

    // If the input day is today or in the past, add 7 to get the next occurrence
    if (dayDifference <= 0) {
        dayDifference += 7;
    }

    // Add the day difference to the current date to get the next occurrence
    const nextOccurrenceDate = currentDate.add(dayDifference, "days");
    return nextOccurrenceDate;
};

const getUppercase = (input) => {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
};

module.exports = {
    getCustomerWAID,
    getNextDayDate,
    getUppercase,
};
