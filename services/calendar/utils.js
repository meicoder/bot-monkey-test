const moment = require("moment");
const { openingHours } = require("../../constants");
const { listEvents } = require("./controller");
const { getUppercase } = require("../../helpers");

const validateTime = async (inputTime, date) => {
    inputTime = inputTime.split(":")[0].length === 1 ? `0${inputTime}` : inputTime;
    const timeRegex = /^(0[1-9]|1[0-2]|1[3-9]|2[0-4]):[0-5][0-9]$/;

    // Validate format
    if (!timeRegex.test(inputTime)) {
        return {
            valid: false,
            msg: `⚠️ "${inputTime}" no es una hora válida. Escribe la hora en formato 24HH:MM. Ej. 09:30 o 15:30\n\n↩️ _Si deseas volver al menú principal, envía *Volver* o *0*_`,
        };
    }

    // Validate time is in between openning hours
    const [hour, minute] = inputTime.split(":");
    const dateTime = date.hour(hour).minute(minute).seconds(0).milliseconds(0);
    const daySelected = getUppercase(dateTime.format("dddd"));
    const openHours = openingHours[daySelected];

    const openHoursRange = openHours.find((range) => {
        const [fromHour, fromMinute] = range.from.split(":");
        const [toHour, toMinute] = range.to.split(":");
        const from = dateTime.clone().hour(fromHour).minute(fromMinute).seconds(0).milliseconds(0);

        const to = dateTime.clone().hour(toHour).minute(toMinute).seconds(0).milliseconds(0);

        return moment(dateTime).isBetween(from, to, undefined, "[]");
    });

    return {
        valid: !!openHoursRange,
        msg: `⚠️ "${inputTime}" está fuera de nuestro horario de atención\n\n_Los días ${dateTime.format(
            "dddd"
        )} atendemos:_\n- _Mañana: de ${openingHours[daySelected][0].from} a ${
            openingHours[daySelected][0].to
        }_\n- _Tarde: de ${openingHours[daySelected][1].from} a ${
            openingHours[daySelected][1].to
        }_\n\n↩️ _Si deseas volver al menú principal, envía *Volver* o *0*_`,
    };
};

const validateWithCalendar = async (inputTime, date) => {
    // Validate time is free
    let msg;
    const [hour, minute] = inputTime.split(":");
    const dateTime = date.hour(hour).minute(minute).seconds(0).milliseconds(0);
    const scheduledEvents = await listEvents(dateTime);
    const isHalfOrOclock = dateTime.clone().minute() === 0 || dateTime.clone().minute() === 30;
    const newEventStart = isHalfOrOclock ? dateTime.clone() : roundMinutesToInterval(dateTime.clone());
    const newEventEnd = newEventStart.clone().add(30, "m");
    const hasConflict = scheduledEvents.find((event) => {
        const eventStart = moment(event.start.dateTime, "YYYY-MM-DDTHH:mm:ss.SSSZ");
        const eventEnd = moment(event.end.dateTime, "YYYY-MM-DDTHH:mm:ss.SSSZ");
        return (
            moment(newEventStart).isBetween(eventStart, eventEnd, undefined, "[]") ||
            moment(newEventEnd).isBetween(eventStart, eventEnd, undefined, "[]")
        );
    });
    if (hasConflict) {
        let busyTime = true;
        while (busyTime) {
            const alreadyEvent = scheduledEvents.find((event) => {
                const eventStart = moment(event.start.dateTime, "YYYY-MM-DDTHH:mm:ss.SSSZ");
                const eventEnd = moment(event.end.dateTime, "YYYY-MM-DDTHH:mm:ss.SSSZ");
                return moment(newEventStart).isBetween(eventStart, eventEnd, "minute", "[)");
            });

            if (alreadyEvent === undefined) {
                busyTime = false;
            } else {
                newEventStart.add(30, "m");
            }
        }
        msg = "Existe conflicto con otra(s) cita(s), la siguiente cita disponibles es: ";
    } else if (!hasConflict && !isHalfOrOclock) {
        msg = "La hora más cercana disponible es: ";
    } else {
        msg = "Excelente! Tenemos el espacio disponible para ti. ";
    }
    const dateTimeString = newEventStart.format("dddd, D [de] MMMM [a las] HH:mm [horas (]h:mm a[)]");
    msg += `${
        dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1)
    }. ¿Estás de acuerdo?\n\n💈 1. *Si*\n💈 2. *No*`;
    return {
        msg,
        newEventStart,
    };
};

const roundMinutesToInterval = (inputMoment) => {
    const minutes = inputMoment.minutes();

    let roundedMinutes;

    if (minutes >= 1 && minutes <= 15) {
        roundedMinutes = 0;
    } else if (minutes > 15 && minutes <= 29) {
        roundedMinutes = 30;
    } else if (minutes > 30 && minutes <= 45) {
        roundedMinutes = 30;
    } else {
        // minutes > 45 && minutes <= 59
        inputMoment.add(1, "hour"); // Increment the hour
        roundedMinutes = 0;
    }

    // Set the rounded minutes and clear seconds and milliseconds
    return inputMoment.minutes(roundedMinutes).seconds(0).milliseconds(0);
};
module.exports = {
    validateTime,
    validateWithCalendar,
};
