/**
 * @file Evento ativado quando um usuário utiliza um gatilho.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */
const { WebhookClient } = require('discord.js')
const { canal_dm } = require('../config.json');

module.exports = 
{
    name: "messageCreate",

    async execute (message, client)
    {
        if (message.channel.type === 1 && !message.author.bot)
        {
            let canal = client.channels.cache.get(canal_dm);

            await canal.createWebhook({ name: message.author.username, avatar: message.author.avatarURL({ dynamic: true }) })
            .then(async web => 
            {
                message.channel.send(`<:oab_check:1187428122988126348> **|** Registrei a sua resposta. **Obrigado!**`);
                let mensagem = `## <:oab_logo:1202096934093852732> Sistema OAB\nPrezado(a) Advogado(a),\nEm nome da Excelentíssima **Juíza Marina M. Ricci**, solicito que responda ao questionamento abaixo:\n* **O(a) Dr(a). ainda pretende continuar como advogado(a) no Jurídico da Saturno?**\n*É importante a sua resposta! Não deixe de responder. Digite a sua resposta aqui mesmo.*`;
                await web.send(`## 🤖 Mensagem\n${mensagem}\n## <:oab_email:1187883019667779617> Resposta\n${message.content}`);

                web.delete();
            })
        }

        const args = message.content.split(/ + /);

        if (message.author.bot) return;

        let gatilhado = false;

        message.client.triggers.every((trigger) =>
        {
            if (gatilhado) return false;

            trigger.name.every(async (name) => 
            {
                if (gatilhado) return false;

                if (message.content.includes(name))
                {
                    try
                    {
                        trigger.execute(message, args);
                    }
                    catch (error)
                    {
                        console.error(error);
                    }

                    gatilhado = true;

                    return false;
                }
            })
        })
    }
}