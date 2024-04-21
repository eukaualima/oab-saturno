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
const { footer, casos_dp, cor_embed, cargo_advogado, cargo_estagiario, cargo_juiz, cargo_adm } = require("../../../config.json");

moment.tz('America/Sao_Paulo')

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("rprisao")
    .setDescription("Informe a conclusão de mandado.")
    .addIntegerOption(option =>
        option
        .setName("id")
        .setDescription("Qual o ID do mandado?")
        .setMinValue(1)
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("policial")
        .setDescription("Qual o nome do policial responsável da prisão?")
        .setMinLength(1)
        .setRequired(true)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const id = interaction.options.getInteger("id");

        pool.query(`SELECT * FROM mandados WHERE codigo = ${id}`, async function (erro, mandado)
        {
            let prisao = mandado[0].prisao;

            if (erro)
            {
                return interaction.editReply({ content: `<:oab_error:1187428311014576208> | Não há um mandado com este ID.` });
            }
            else if (prisao == "Efetuada")
            {
                return interaction.editReply({ content: `<:oab_error:1187428311014576208> | Prisão já registrada.` });
            }

            pool.query(`UPDATE mandados SET prisao = "Efetuada" WHERE codigo = ${id}`);
            
            return interaction.editReply({ content: `<:oab_check:1187428122988126348> | Prisão registrada com sucesso.` })
        })
	},
};
