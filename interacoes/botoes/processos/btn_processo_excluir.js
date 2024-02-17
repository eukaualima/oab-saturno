/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, Collection, PermissionsBitField, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const pool = require('../../../conexao/mysql');
const { cargo_juiz } = require('../../../config.json');

// < Inicia o botão >
module.exports = 
{
	id: "btn_processo_excluir",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Cria os botões >
        const btn_processo_excluir_sim = new ButtonBuilder()
        .setCustomId('btn_processo_excluir_sim')
        .setLabel(`Tenho certeza!`)
        .setStyle(ButtonStyle.Success)
        .setEmoji(`1187428122988126348`);

        const btn_processo_excluir_nao = new ButtonBuilder()
        .setCustomId('btn_processo_excluir_nao')
        .setLabel(`Não`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji(`1187428311014576208`);

        const botoes = new ActionRowBuilder()
        .addComponents(btn_processo_excluir_sim, btn_processo_excluir_nao);

        return await interaction.reply({ content: `# <:oab_aviso:1188557292073918555> Ação IRREVERSÍVEL\n${interaction.user}, tem certeza que deseja **APAGAR** o canal?`, components: [botoes] });
    },
};