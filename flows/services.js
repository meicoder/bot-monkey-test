const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const fs = require("fs");
const { askToSchedule } = require("./askToSchedule");

const servicesFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic, gotoFlow }) => {
    await flowDynamic("Nuestros Servicios son:");
    try {
        const jsonString = fs.readFileSync("./data.json");
        const { services } = JSON.parse(jsonString);
        const listOfServices = services.map((service) => ({
            body: `${service.name} \n🤑 Costo: ${service.price} Bs`,
            media: service.image,
        }));
        await flowDynamic(listOfServices);
        return gotoFlow(askToSchedule);
    } catch (err) {
        console.log("Error reading data file in Services", err);
        return;
    }
});

module.exports = {
    servicesFlow,
};
