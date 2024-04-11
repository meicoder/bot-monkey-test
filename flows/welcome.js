const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const { simpleWelcomeFlow } = require("./simpleWelcome");
const { aiWelcomeFlow } = require("./aiWelcome");

const welcomeFlow = addKeyword(EVENTS.WELCOME).addAction(async (_, { globalState, gotoFlow }) => {
    const { ai } = globalState.getMyState();
    if (ai) {
        return gotoFlow(aiWelcomeFlow);
    } else {
        return gotoFlow(simpleWelcomeFlow);
    }
});

module.exports = {
    welcomeFlow,
};
