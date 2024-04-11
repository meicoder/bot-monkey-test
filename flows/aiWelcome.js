const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const aiWelcomeFlow = addKeyword(EVENTS.ACTION).addAction(async (ctx, ctxFn) => {
    const userMessage = ctx.body;
    console.log("userMessage", userMessage);
    const pluginAi = ctxFn.extensions.employeesAddon;

    const employeeFound = await pluginAi.determine(userMessage);
    pluginAi.gotoFlow(employeeFound.employee, ctxFn);
});

module.exports = {
    aiWelcomeFlow,
};
