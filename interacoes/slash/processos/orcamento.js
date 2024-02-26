/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment-timezone');
const { footer, cargo_adm, cargo_juiz, cargo_promotor } = require("../../../config.json");

moment.tz('America/Sao_Paulo')

function honorarios(meses)
{
    if (meses <= 12)
    {
        return 50000;
    }
    else
    {
        return meses * 4000;
    }
}

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("orcamento")
    .setDescription("Calcule rapidamente o valor para limpeza de ficha.")
    .addIntegerOption(option =>
        option
        .setName("meses")
        .setDescription("Quantos meses seu cliente possui no MDT?")
        .setMinValue(1)
        .setRequired(true)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Coleta os dados passados no comando >
        const meses = interaction.options.getInteger("meses");
        
        let valor = honorarios(meses);

        // < Retorna o valor >
        return interaction.editReply({ content: `**<:oab_honorarios2:1205644366899847228> | Honorários:** R$ ${valor.toLocaleString('pt-BR')},00` });

	},
};
