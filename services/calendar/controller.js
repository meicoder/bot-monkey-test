const { google } = require("googleapis");
const { calendar, clientAuth } = require("./service");
const { openingHours } = require("../../constants");
const { getUppercase } = require("../../helpers");

// Lista eventos
async function listEvents(eventStarDatetime) {
    const auth = await clientAuth.getClient();
    const daySelected = getUppercase(eventStarDatetime.format("dddd"));
    const [hour, minute] = openingHours[daySelected][1].to.split(":");
    const timeMax = eventStarDatetime.clone().hour(hour).minute(minute);
    const events = await calendar.events.list({
        auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: eventStarDatetime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        timeMax: timeMax.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        singleEvents: true,
        orderBy: "startTime",
    });
    return events.data.items;
}

// Crea un evento en el calendario
async function createEvent(eventData) {
    const auth = await clientAuth.getClient();
    const event = {
        summary: `Reserva de ${eventData.customerName}`,
        description: `Reserva de ${eventData.customerName}`,
        location: eventData.location,
        start: {
            dateTime: eventData.dateTimeStart.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            timeZone: "America/La_Paz",
        },
        end: {
            dateTime: eventData.dateTimeStart.clone().add(30, "m").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            timeZone: "America/La_Paz",
        },
        reminders: {
            useDefault: false,
            overrides: [{ method: "popup", minutes: 10 }],
        },
    };

    try {
        const response = await calendar.events.insert({
            auth,
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            resource: event,
        });
        return response.data;
    } catch (error) {
        console.log("error creating event in google calendar: ", error);
    }
}

// Elimina un evento del calendario
async function deleteEvent(eventId) {
    const auth = await googleCalendarService.authorize();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
    });
}

// Actualiza un evento del calendario
async function updateEvent(eventId, eventData) {
    const auth = await googleCalendarService.authorize();
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
            dateTime: eventData.startTime,
        },
        end: {
            dateTime: eventData.endTime,
        },
    };

    const response = await calendar.events.update({
        calendarId: "primary",
        eventId: eventId,
        resource: event,
    });

    return response.data;
}

module.exports = {
    listEvents,
    createEvent,
    deleteEvent,
    updateEvent,
};
