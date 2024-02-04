/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder, Embed } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { footer, cor_embed } = require('../../../config.json');
const moment = require('moment');
moment.locale('pt-BR')

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Veja as suas informações no sistema da OAB.")
        .addUserOption(option =>
            option
            .setName("usuário")
            .setDescription("Informe o usuário que deseja ver o perfil.")
        ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const usuario = interaction.options.getUser("usuário");

        if (usuario)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${usuario.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return await interaction.editReply({ content: `<:oab_error:1187428311014576208> | ${usuario.displayName} **não faz parte** do corpo jurídico!` });
                }

                let processos, casos, registro, passaporte, cargo;

                processos = servidores[0].processos;
                casos = servidores[0].casos;
                registro = moment(servidores[0].registro).format('LLLL');
                passaporte = servidores[0].passaporte;
                cargo = servidores[0].cargo;

                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setTitle(`<:oab_perfil:1202047733201117204> Perfil Jurídico`)
                .setDescription(`Abaixo todas as informações sobre o registro de **${usuario.displayName}** na OAB.`)
                .setColor(cor_embed)
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
        }
        else
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return await interaction.editReply({ content: `<:oab_error:1187428311014576208> | Você **não faz parte** do corpo jurídico!` });
                }

                let processos, casos, registro, passaporte, cargo;
    
                processos = servidores[0].processos;
                casos = servidores[0].casos;
                registro = moment(servidores[0].registro).format('LLLL');
                passaporte = servidores[0].passaporte;
                cargo = servidores[0].cargo;
    
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setTitle(`<:oab_perfil:1202047733201117204> Meu Perfil Jurídico`)
                .setDescription(`Abaixo todas as informações sobre o seu registro na OAB.`)
                .setColor(cor_embed)
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
        }
	},
};
