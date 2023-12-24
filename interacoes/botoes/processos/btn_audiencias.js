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
	id: "btn_audiencias",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_audiencia")
        .setTitle('Audiência criminal/trabalhista')

        // < Cria os campos >
        const assunto = new TextInputBuilder()
            .setCustomId('audiencia_assunto')
            .setLabel("Assunto:")
            .setPlaceholder("Informe o que será tratado na audiência")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        
        const partes = new TextInputBuilder()
            .setCustomId('audiencia_partes')
            .setLabel("Partes envolvidas:")
            .setPlaceholder("Nome completo e passaporte de cada envolvido(a)")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        
        const testemunhas = new TextInputBuilder()
            .setCustomId('audiencia_testemunhas')
            .setLabel("Testemunhas:")
            .setPlaceholder("Nome completo e passaporte das testemunhas envolvidas (caso tenha)")
            .setStyle(TextInputStyle.Paragraph);
        
        const assunto_campo = new ActionRowBuilder().addComponents(assunto);
        const partes_campo = new ActionRowBuilder().addComponents(partes);
        const testemunhas_campo = new ActionRowBuilder().addComponents(testemunhas);

        // < Adiciona os campos ao modal >
        modal.addComponents(assunto_campo, partes_campo, testemunhas_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};