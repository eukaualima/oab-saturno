/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { Permissions, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "btn_prova_reprovado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_prova_reprovado")
        .setTitle('Reprovar candidato(a)')

        // < Cria os campos >
        const passaporte = new TextInputBuilder()
            .setCustomId('prova_passaporte')
            .setLabel("Passaporte do candidato")
            .setPlaceholder("1234")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const motivo = new TextInputBuilder()
            .setCustomId('prova_motivo')
            .setLabel("Por que foi reprovado(a)?")
            .setPlaceholder("Errou muitas questões")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const passaporte_campo = new ActionRowBuilder().addComponents(passaporte);
        const motivo_campo = new ActionRowBuilder().addComponents(motivo);

        // < Adiciona os campos ao modal >
        modal.addComponents(passaporte_campo, motivo_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};