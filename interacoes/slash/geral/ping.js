/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Verifica o ms atual do sistema da OAB."),

    // < Executa o comando >
	async execute(interaction) 
    {
        const sent = await interaction.reply({ content: '<a:oab_ping:1187579459893739561> **|** Calculando...', fetchReply: true });
        interaction.editReply(`<a:oab_ping:1187579459893739561> **|** Atualmente eu demoro **${sent.createdTimestamp - interaction.createdTimestamp}ms** para responder aos comandos.`);
	},
};
