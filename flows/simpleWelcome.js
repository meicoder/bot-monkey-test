const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const { promoFlow } = require("./promo");
const { scheduleFlow } = require("./scheduleFlow");
const { servicesFlow } = require("./services");
const { vipServicesFlow } = require("./vipServices");
const { branchesFlow } = require("./branches");

const simpleWelcomeFlow = addKeyword(EVENTS.ACTION).addAnswer(
    [
        "👋 Hola soy el *Chatbot* de Monkey's 🤖🐵",
        "\nEscribe el número o palabra de la opción que desees:\n",
        "💈 1. *Sucursales*",
        "💈 2. *Servicios*",
        "💈 3. *Reservas*",
        "💈 4. *Promociones*",
        "💈 5. *VIP*",
        "\n↩️ _0. *Salir*_",
    ],
    { capture: true },
    async (ctx, { fallBack, endFlow, gotoFlow }) => {
        if (["0", "Salir"].includes(ctx.body)) {
            return endFlow("¡Hasta luego! Espero haberte sido de ayuda. ¡Vuelve pronto! 👋");
        } else if (["1", "SUCURSALES"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(branchesFlow, 0);
        } else if (["2", "SERVICIOS"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(servicesFlow, 0);
        } else if (["3", "RESERVAS"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(scheduleFlow, 0);
        } else if (["4", "PROMOCIONES"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(promoFlow, 0);
        } else if (["5", "VIP"].includes(ctx.body.toUpperCase())) {
            return gotoFlow(vipServicesFlow, 0);
        } else if (ctx.body.startsWith("_event_voice_note_")) {
            const { voiceNoteFlow } = require("./voiceNote");
            return gotoFlow(voiceNoteFlow, 0);
        } else if (ctx.body.startsWith("_event_media_")) {
            const { mediaFlow } = require("./media");
            return gotoFlow(mediaFlow, 0);
        } else {
            return fallBack(
                "⚠️ Esa opción no es válida. \n\n↩️ _Si deseas salir de la conversación, envía *Salir* o *0*_"
            );
        }
    },
    [branchesFlow, servicesFlow, scheduleFlow, promoFlow, vipServicesFlow]
);

module.exports = {
    simpleWelcomeFlow,
};
