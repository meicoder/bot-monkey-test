const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askConfirmation } = require("./askConfirmation");
const { askTimeGoogleCalendar } = require("./askTimeGoogleCalendar");
const { validateTime, validateWithCalendar } = require("../../services/calendar/utils");
const { openingHours } = require("../../constants");
const { getUppercase } = require("../../helpers");

const askTime = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic, state }) => {
        const scheduleState = state.getMyState();
        const daySelected = getUppercase(scheduleState.date.format("dddd"));
        await flowDynamic(
            `⏰ ¿A qué hora deseas reservar?\n\n_Los días ${scheduleState.date.format(
                "dddd"
            )} atendemos:_\n- _Mañana: de ${openingHours[daySelected][0].from} a ${
                openingHours[daySelected][0].to
            }_\n- _Tarde: de ${openingHours[daySelected][1].from} a ${openingHours[daySelected][1].to}_`
        );
    })
    .addAnswer(
        "⏳",
        { capture: true },
        async (ctx, { fallBack, gotoFlow, state, globalState }) => {
            const scheduleState = state.getMyState();
            if (["0", "VOLVER"].includes(ctx.body.toUpperCase())) {
                const { welcomeFlow } = require("../welcome");
                return gotoFlow(welcomeFlow, 1);
            }
            if (scheduleState.date === undefined) {
                fallBack("Hubo un problema interno");
            }
            const { valid, msg } = await validateTime(ctx.body, scheduleState.date);
            if (!valid) {
                return fallBack(msg);
            }
            await state.update({ time: ctx.body });
            const currentGlobalState = globalState.getMyState();
            if (currentGlobalState.googleCalendar) {
                return gotoFlow(askTimeGoogleCalendar);
            } else {
                return gotoFlow(askConfirmation);
            }
        },
        [askConfirmation, askTimeGoogleCalendar]
    );
module.exports = {
    askTime,
};
