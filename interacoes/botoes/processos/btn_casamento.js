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
	id: "btn_casamento",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_casamento")
        .setTitle('Casamento')

        // < Cria os campos >
        const noiva = new TextInputBuilder()
            .setCustomId('casamento_noiva')
            .setLabel("Nome e passaporte da noiva:")
            .setPlaceholder("Nome completo e passaporte da noiva")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const noivo = new TextInputBuilder()
            .setCustomId('casamento_noivo')
            .setLabel("Nome e passaporte do noivo:")
            .setPlaceholder("Nome completo e passaporte do noivo")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const testemunhas = new TextInputBuilder()
            .setCustomId('casamento_testemunhas')
            .setLabel("Nome e passaporte das testemunhas (2 apenas):")
            .setPlaceholder("Nome completo e passaporte das testemunhas")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        
        const data = new TextInputBuilder()
            .setCustomId('casamento_data')
            .setLabel("Data e hora do casamento:")
            .setPlaceholder("Informe a data e hora escolhida pelo seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const noiva_campo = new ActionRowBuilder().addComponents(noiva);
        const noivo_campo = new ActionRowBuilder().addComponents(noivo);
        const testemunhas_campo = new ActionRowBuilder().addComponents(testemunhas);
        const data_campo = new ActionRowBuilder().addComponents(data);

        // < Adiciona os campos ao modal >
        modal.addComponents(noiva_campo, noivo_campo, testemunhas_campo, data_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};