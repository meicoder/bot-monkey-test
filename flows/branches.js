const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askToSchedule } = require("./askToSchedule");
const fs = require("fs");

const branchesFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { provider, flowDynamic }) => {
        await flowDynamic("Nuestras Sucursales son:");
        const id = ctx.key.remoteJid;
        const sock = await provider.getInstance();
        try {
            const jsonString = fs.readFileSync("./data.json");
            const { branches } = JSON.parse(jsonString);
            branches.forEach(async (branch) => {
                await sock.sendMessage(id, {
                    location: {
                        degreesLatitude: branch.latitude,
                        degreesLongitude: branch.longitude,
                        name: branch.name,
                    },
                });
            });
        } catch (err) {
            console.log("Error sending branches", err);
            return;
        }
    })
    .addAnswer(
        "⏳",
        null,
        async (_, { gotoFlow }) => {
            return gotoFlow(askToSchedule);
        },
        [askToSchedule]
    );

module.exports = { branchesFlow };
