const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getCustomerWAID } = require("../../helpers");
const { createEvent } = require("../../services/calendar/controller");

const askConfirmation = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state }) => {
        const scheduleState = state.getMyState();
        const dateTimeString = scheduleState.date.format("dddd, D [de] MMMM, YYYY");
        await flowDynamic(
            `👀 Revisa tus datos de reserva:\n\n💇🏻‍♂️ Nombre: ${scheduleState.customerName}\n📅 Dia: ${
                dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1)
            }\n⏰ Hora: ${scheduleState.date.format("HH:mm [horas (]h:mm a[)]")}\n📍 Sucursal: ${scheduleState.branch}`
        );
    })
    .addAnswer(
        "Escribe *CONFIRMO* si todo esta correcto para confirmar tu reserva.\n\n_Escribe *CANCELAR* para volver al menú principal_",
        { capture: true },
        async (ctx, { fallBack, gotoFlow, flowDynamic, provider, endFlow, state, globalState }) => {
            if (["CANCELAR"].includes(ctx.body.toUpperCase())) {
                const { welcomeFlow } = require("../welcome");
                return gotoFlow(welcomeFlow, 1);
            }
            if (!["CONFIRMO", "CANCELAR"].includes(ctx.body.toUpperCase())) {
                return fallBack(
                    "⚠️ Esa opción no es válida.\n\n _Escribe *CONFIRMO* si todo esta correcto para confirmar tu reserva._ \n\n _Escribe *CANCELAR* para volver al menú principal_"
                );
            }
            const scheduleState = state.getMyState();
            const currentGlobalState = globalState.getMyState();
            if (currentGlobalState.googleCalendar) {
                const eventData = {
                    customerName: scheduleState.customerName,
                    location: scheduleState.branch,
                    dateTimeStart: scheduleState.date,
                };
                try {
                    await createEvent(eventData);
                    await flowDynamic("Reserva confirmada 📆");
                } catch (error) {
                    console.log("Create Event Error", error);
                }
            } else {
                await flowDynamic("En unos minutos te confirmaremos la reserva 📆");
                const id = ctx.key.remoteJid;
                const sock = await provider.getInstance();
                const vcard =
                    "BEGIN:VCARD\n" + // metadata of the contact card
                    "VERSION:3.0\n" +
                    "FN:" +
                    scheduleState.name +
                    "\n" + // full name
                    "ORG:Cliente Monkeys;\n" + // the organization of the contact
                    "TEL;type=CELL;type=VOICE;waid=" +
                    getCustomerWAID(id) +
                    ":+" +
                    getCustomerWAID(id) +
                    "\n" + // WhatsApp ID + phone number
                    "END:VCARD";
                const dateTimeString = newEventStart.format("dddd, D [de] MMMM, YYYY");
                await sock.sendMessage(process.env.RECEPCIONIST_JID, {
                    text: `Nueva reserva:\n💇🏻‍♂️ Nombre: ${scheduleState.customerName}\n📅 Dia: ${
                        dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1)
                    }\n⏰ Hora: ${scheduleState.date.format("HH:mm [horas (]h:mm a[)]")}\n📍 Sucursal: ${
                        scheduleState.branch
                    }`,
                });

                await sock.sendMessage(process.env.RECEPCIONIST_JID, {
                    contacts: {
                        displayName: scheduleState.name,
                        contacts: [{ vcard }],
                    },
                });
            }
            return endFlow("¡Hasta luego! Espero haberte sido de ayuda. ¡Vuelve pronto! 👋");
        }
    );

module.exports = {
    askConfirmation,
};
