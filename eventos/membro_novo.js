/**
 * @file Evento ativado quando um usuário entra no servidor.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

const { EmbedBuilder } = require('discord.js');
const { canal_entrada, cor_embed, footer, cargo_visitante } = require('../config.json');

module.exports = 
{
    name: "guildMemberAdd",

    async execute (member, client)
    {
        const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`👋 Bem-vindo(a)`)
        .setDescription(`${member.user}, seja bem-vindo(a) ao servidor do Jurídico Saturno RP!`)
        .setColor(cor_embed)
        .addFields([
            { name: `<:oab_partes:1188556237911109764> | Entrou para o jurídico?`, value: `Solicite seu cargo no canal <#1106991210175922238>.` },
            { name: `<:oab_cliente:1188541685572051054> | Quer entrar para o jurídico?`, value: `Inicie agora mesmo a sua prova no canal <#1205325979677884477>.` },
            { name: `<:oab_questao:1204999334853214260> | Dúvidas?`, value: `Qualquer dúvida, entre em contato através do canal <#1106279181106544775>.` },
        ])
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setImage('https://i.imgur.com/dvIWHDW.png')
        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

        // < Seta o cargo do usuário >
        await member.roles.add(cargo_visitante);

        // < Envia a mensagem no canal >
        let canal = await client.channels.cache.get(canal_entrada);
        await canal.send({ content: `${member.user}`, embeds: [embed] });
    }
}