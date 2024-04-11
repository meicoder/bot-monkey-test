const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askToSchedule } = require("./askToSchedule");
const fs = require("fs");

const vipServicesFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic, gotoFlow }) => {
    await flowDynamic("Nuestros servicios VIP 😎 son:");
    try {
        const jsonString = fs.readFileSync("./data.json");
        const { vipServices } = JSON.parse(jsonString);
        const listOfVipServices = vipServices.map((service) => ({
            body: `${service.name} \n${service.description}\n\n🤑 Costo: ${service.price} Bs`,
            media: service.image,
        }));
        await flowDynamic(listOfVipServices);
        return gotoFlow(askToSchedule);
    } catch (err) {
        console.log("Error reading data file in VIP", err);
        return;
    }
});

module.exports = {
    vipServicesFlow,
};
