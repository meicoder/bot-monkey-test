const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { welcomeFlow } = require('./welcome');

const mediaFlow = addKeyword(EVENTS.MEDIA).addAnswer(
    'Por el momento no puedo ver la imagen 🙈',
    null,
    (_, { gotoFlow }) => {
        return gotoFlow(welcomeFlow, 1);
    }
);

module.exports = {
    mediaFlow
};
