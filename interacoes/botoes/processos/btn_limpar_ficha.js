/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, Collection, PermissionsBitField, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const pool = require('../../../conexao/mysql');

// < Inicia o botão >
module.exports = 
{
	id: "btn_limpar_ficha",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_limpar_ficha")
        .setTitle('Limpeza de Fichas')

        // < Cria os campos >
        const reu_nome = new TextInputBuilder()
            .setCustomId('limpar_ficha_reu_nome')
            .setLabel("Nome do réu:")
            .setPlaceholder("Nome do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const reu_id = new TextInputBuilder()
            .setCustomId('limpar_ficha_reu_id')
            .setLabel("Passaporte do réu:")
            .setPlaceholder("Passaporte do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const meses = new TextInputBuilder()
            .setCustomId('limpar_ficha_meses')
            .setLabel("Meses totais do réu:")
            .setPlaceholder("Meses totais de prisão do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const reu_nome_campo = new ActionRowBuilder().addComponents(reu_nome);
        const reu_id_campo = new ActionRowBuilder().addComponents(reu_id);
        const meses_campo = new ActionRowBuilder().addComponents(meses);

        // < Adiciona os campos ao modal >
        modal.addComponents(reu_nome_campo, reu_id_campo, meses_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};