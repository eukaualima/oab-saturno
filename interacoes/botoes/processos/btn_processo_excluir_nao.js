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
	id: "btn_processo_excluir_nao",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        await interaction.update({ content: `<:oab_logo:1202096934093852732> **|** Ok! Tudo bem.`, components: [] }).then(msg => setTimeout(() => msg.delete(), 5000));
    },
};