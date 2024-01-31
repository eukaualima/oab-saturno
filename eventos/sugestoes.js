/**
 * @file Evento ativado quando um usuário utiliza um gatilho.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

const { canal_sugestoes } = require('../config.json');

module.exports = 
{
    name: "messageCreate",

    async execute (message)
    {
        if (message.channel.id === canal_sugestoes)
        {
            message.react('1202079385646288956');
            message.react('1202079382571847742');
        }
    }
}