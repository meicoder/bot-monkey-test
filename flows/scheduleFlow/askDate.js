const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { daysOfWeek } = require("../../constants");
const { askTime } = require("./askTime");
const { getNextDayDate, getUppercase } = require("../../helpers");

const askDate = addKeyword(EVENTS.ACTION).addAnswer(
    "📅 ¿Qué día nos visitarás?\n\n_Atendemos de Lunes a Sábado_",
    { capture: true },
    async (ctx, { fallBack, gotoFlow, state }) => {
        if (["0", "VOLVER"].includes(ctx.body.toUpperCase())) {
            const { welcomeFlow } = require("../welcome");
            return gotoFlow(welcomeFlow, 1);
        }
        if (!daysOfWeek.includes(ctx.body.toUpperCase())) {
            return fallBack(
                "⚠️ Esa opción no es válida. Escribe el día de la semana entre Lunes y Sábado\n\n↩️ _Si deseas volver al menú principal, envía *Volver* o *0*_"
            );
        }
        const selelectedDay = getUppercase(ctx.body);
        const nextDayDate = getNextDayDate(selelectedDay);
        await state.update({ date: nextDayDate });
        return gotoFlow(askTime);
    },
    [askTime]
);

module.exports = {
    askDate,
};
