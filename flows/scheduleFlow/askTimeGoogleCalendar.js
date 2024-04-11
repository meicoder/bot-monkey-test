const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askConfirmation } = require("./askConfirmation");
const { validateWithCalendar } = require("../../services/calendar/utils");

const askTimeGoogleCalendar = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state }) => {
        const scheduleState = state.getMyState();
        const { msg, newEventStart } = await validateWithCalendar(scheduleState.time, scheduleState.date);
        await state.update({ date: newEventStart });
        await flowDynamic(msg);
    })
    .addAnswer(
        "⏳",
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (["1", "SI"].includes(ctx.body.toUpperCase())) {
                const { askConfirmation } = require("./askConfirmation");
                return gotoFlow(askConfirmation, 0);
            } else if (["2", "NO"].includes(ctx.body.toUpperCase())) {
                const { askTime } = require("./askTime");
                return gotoFlow(askTime, 0);
            } else {
                return fallBack("⚠️ Esa opción no es válida.\n\n_Escribe la opción que desees_");
            }
        },
        [askConfirmation]
    );

module.exports = {
    askTimeGoogleCalendar,
};
