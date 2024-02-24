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

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("isentar")
    .setDescription("Isente um policial investigativo de pagar R$ 500.000,00 na troca de nome.")
    .addIntegerOption(option =>
        option
        .setName("passaporte")
        .setDescription("Qual é o passaporte do policial?")
        .setMinValue(0)
        .setRequired(true)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Coleta os dados passados no comando >
        const passaporte = interaction.options.getInteger("passaporte");

        // < Verifica se o usuário é Juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_adm))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Lógica do comando >
        pool.query(`INSERT INTO isentos (passaporte, responsavel) VALUES (${passaporte}, '${interaction.user.id}')`, async function (erro, insentos)
        {
            if (erro)
            {
                return interaction.editReply({ content: `# <:oab_error:1187428311014576208> Isenção não aplicada\nO policial de passaporte **${passaporte}** já recebe **50%** de desconto na **troca de nome**.` });
            }
            else
            {
                return interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Isenção aplicada\nAgora, o policial de passaporte **${passaporte}** receberá **50%** de desconto na **troca de nome**.` });
            }
        });

	},
};
