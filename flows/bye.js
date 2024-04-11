const { addKeyword } = require('@bot-whatsapp/bot');
const byeFlow = addKeyword(
    [
        'gracias',
        'eso es todo',
        'solo eso',
        'nos vemos',
        'chau',
        'chao',
        'adios',
        'bye'
    ],
    {
        sensitive: false
    }
).addAnswer('¡Hasta luego! Espero haberte sido de ayuda. ¡Vuelve pronto! 👋');

module.exports = {
    byeFlow
};
