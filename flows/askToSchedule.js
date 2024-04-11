const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { scheduleFlow } = require("./scheduleFlow");

const askToSchedule = addKeyword(EVENTS.ACTION).addAnswer(
    ["Te gustaría realizar una reserva?", "\n💈 1. *Si*", "💈 2. *No*", "\n↩️ _0. *Volver*_"],
    {
        capture: true,
        delay: 1500,
    },
    async (ctx, { gotoFlow, fallBack }) => {
        if (["1", "SI"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(scheduleFlow, 0);
        } else if (["2", "NO", "0", "VOLVER"].includes(ctx.body.toUpperCase())) {
            const { welcomeFlow } = require("./welcome");
            return gotoFlow(welcomeFlow, 1);
        } else {
            return fallBack(
                "⚠️ Esa opción no es válida. Escribe *'Si'* o *'No'* según tu preferencia\n\n↩️ _Si deseas volver al menú principal, envía *Volver* o *0*_"
            );
        }
    },
    [scheduleFlow]
);

module.exports = { askToSchedule };
