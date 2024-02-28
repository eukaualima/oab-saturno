/**
 * @file Evento ativado quando um usuário utiliza um gatilho.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */
const { canal_backup } = require('../config.json');
const fs = require('fs')

module.exports = 
{
    name: "messageCreate",

    async execute (message, client)
    {
        let codigo = message.channel.name.replace(/[^0-9]/g,'');

        // < Verifica se é um arquivo de imagem, se não é o bot e se é um canal de processo >
        if (message.attachments.size > 0 && message.author.id != client.user.id && codigo) 
        {
            let arquivo = message.attachments.first();
    
            if (arquivo.height) 
            {
                let canal = client.channels.cache.get(canal_backup);

                canal.send({ content: `# <:juridico_alerta:1211738261089951764> Backup de prova\n* Prova enviada no canal \`${message.channel.name}\` (<#${message.channel.id}>)\n* Por: ${message.author}`, files: [{ attachment: arquivo.url, name: arquivo.name }] }).catch(console.error);
            }
        }
    }
}