const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const fs = require("fs");
const { askToSchedule } = require("./askToSchedule");

const promoFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic, gotoFlow }) => {
    await flowDynamic("Nuestras promociones del mes son:");
    try {
        const jsonString = fs.readFileSync("./data.json");
        const { promos } = JSON.parse(jsonString);
        const listOfPromos = promos.map((promo) => ({
            body: `${promo.name}\n🤑 Costo: ${promo.price} Bs\n${promo.description}`,
            media: promo.image,
        }));
        await flowDynamic(listOfPromos);
        return gotoFlow(askToSchedule);
    } catch (err) {
        console.log("Error reading data file in Promo", err);
        return;
    }
});

module.exports = {
    promoFlow,
};
