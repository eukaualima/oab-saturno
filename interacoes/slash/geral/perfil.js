/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder, Embed } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { footer } = require('../../../config.json');
const moment = require('moment');
moment.locale('pt-BR')

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Veja as suas informações no sistema da OAB."),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
        {
            let processos, casos, registro, passaporte, cargo;

            processos = servidores[0].processos;
            casos = servidores[0].casos;
            registro = moment(servidores[0].registro).format('LLLL');
            passaporte = servidores[0].passaporte;
            cargo = servidores[0].cargo;

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTitle(`<:oab_adv:1188267318875271168> Perfil Jurídico`)
            .setDescription(`Abaixo todas as informações sobre o registro de **${interaction.user.displayName}** na OAB.`)
            .addFields
            (
                { name: '<:oab_balanca:1187577597173960754> | Cargo', value: `${cargo}`, inline: true },
                { name: '<:oab_passaporte:1188496362334072882> | Passaporte', value: `${passaporte}`, inline: true },
                { name: '<:oab_data:1188268177063424050> | Registrado(a) em', value: `${registro}` },
                { name: '<:oab_veredito:1187577594472837171> | Processos', value: `\`\`\`js\n${processos.toLocaleString('pt-BR')}\`\`\``, inline: true },
                { name: '<:oab_algemas:1188269430388559892> | Casos DP', value: `\`\`\`js\n${casos.toLocaleString('pt-BR')}\`\`\``, inline: true },
            )
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: `${footer}`, iconURL: client.user.avatarURL() });

            await interaction.editReply({ embeds: [embed] });
        })
	},
};
