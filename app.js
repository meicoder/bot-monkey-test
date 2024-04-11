require("dotenv").config();
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");

// Providers
const { adapterDB } = require("./provider/database");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");

// Flows
const { welcomeFlow } = require("./flows/welcome");
const { voiceNoteFlow } = require("./flows/voiceNote");
const { mediaFlow } = require("./flows/media");
const { byeFlow } = require("./flows/bye");
const { infoFlow } = require("./flows/AIFlows/info");
const { scheduleFlow } = require("./flows/AIFlows/schedule");
const { simpleWelcomeFlow } = require("./flows/simpleWelcome");
const { aiWelcomeFlow } = require("./flows/aiWelcome");

// Services
const { createGoogleCalenderCredentials } = require("./services/calendar/config");

// ChatGPT Plugin (employees)
const { init } = require("bot-ws-plugin-openai");
const employeesAddonConfig = {
    model: "gpt-3.5-turbo-16k-0613",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);
employeesAddon.employees([
    {
        name: "EMPLEADO_INFO",
        description:
            "Soy Marcos el vendedor amable encargado de atender a todos los clientes que soliciten mayor informacion sobre los servicios que ofrece la barberia. Mis respuestas son breves",
        flow: infoFlow,
    },
    {
        name: "EMPLEADO_AGENDA",
        description:
            "Soy Sheyla el la encargada de manejar la agenda de la barberia. Tengo el conocimiento de la agenda actual de la barberia y mi responsabilidad es guiar al cliente a agendar una cita en la barberia.",
        flow: scheduleFlow,
    },
]);

const main = async () => {
    createGoogleCalenderCredentials();
    await adapterDB.init();

    const adapterFlow = createFlow([
        welcomeFlow,
        voiceNoteFlow,
        mediaFlow,
        byeFlow,
        infoFlow,
        simpleWelcomeFlow,
        aiWelcomeFlow,
    ]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot(
        {
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        },
        {
            globalState: {
                googleCalendar: true,
                ai: true,
            },
            extensions: {
                employeesAddon,
            },
        }
    );

    QRPortalWeb();
};

main();
