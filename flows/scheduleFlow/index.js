const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askBranch } = require("./askBranch");

const scheduleFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic("🤖 Perfecto!, necesito alguno datos tuyos:");
    })
    .addAnswer(
        "📝 ¿Cual es tu nombre?",
        { capture: true },
        async (ctx, { state, gotoFlow }) => {
            await state.update({ customerName: ctx.body });
            await state.update({ customerNumber: ctx.from });
            return gotoFlow(askBranch);
        },
        [askBranch]
    );

module.exports = {
    scheduleFlow,
};
