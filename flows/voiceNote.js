const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { welcomeFlow } = require('./welcome');

const voiceNoteFlow = addKeyword(EVENTS.VOICE_NOTE).addAnswer(
    'Por el momento no puedo escucharte 🙉',
    null,
    (_, { gotoFlow }) => {
        return gotoFlow(welcomeFlow, 1);
    }
);

module.exports = { voiceNoteFlow };
