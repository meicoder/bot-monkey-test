const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askDate } = require("./askDate");

const askBranch = addKeyword(EVENTS.ACTION).addAnswer(
    ["📍 ¿En cuál sucursal te esperamos?", "\n💈 1. *Miraflores*", "💈 2. *Calacoto*", "\n↩️ _0. *Volver*_"],
    { capture: true },
    async (ctx, { gotoFlow, state, fallBack }) => {
        if (["1", "MIRAFLORES"].includes(ctx.body.toUpperCase())) {
            await state.update({ branch: "MIRAFLORES" });
            return gotoFlow(askDate);
        } else if (["2", "CALACOTO"].includes(ctx.body.toUpperCase())) {
            await state.update({ branch: "CALACOTO" });
            return gotoFlow(askDate);
        } else if (["0", "VOLVER"].includes(ctx.body.toUpperCase())) {
            const { welcomeFlow } = require("../welcome");
            return gotoFlow(welcomeFlow, 1);
        } else {
            return fallBack(
                "⚠️ Esa opción no es válida. Escribe el número o la sucursal que desees\n\n↩️ _Si deseas volver al menú principal, envía *Volver* o *0*_"
            );
        }
    },
    [askDate]
);

module.exports = {
    askBranch,
};
