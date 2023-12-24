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
	id: "btn_certidao",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_certidao")
        .setTitle('Certidão de nascimento')

        // < Cria os campos >
        const crianca = new TextInputBuilder()
            .setCustomId('certidao_crianca')
            .setLabel("Nome e passaporte da criança:")
            .setPlaceholder("Nome completo e passaporte da criança")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const mae = new TextInputBuilder()
            .setCustomId('certidao_mae')
            .setLabel("Nome e passaporte da mãe:")
            .setPlaceholder("Nome completo e passaporte da mãe")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const pai = new TextInputBuilder()
            .setCustomId('certidao_pai')
            .setLabel("Nome e passaporte do pai:")
            .setPlaceholder("Nome completo e passaporte do pai")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const data = new TextInputBuilder()
            .setCustomId('certidao_data')
            .setLabel("Data de nascimento:")
            .setPlaceholder("Data no formato ex.: 23 de janeiro de 2004")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const crianca_campo = new ActionRowBuilder().addComponents(crianca);
        const mae_campo = new ActionRowBuilder().addComponents(mae);
        const pai_campo = new ActionRowBuilder().addComponents(pai);
        const data_campo = new ActionRowBuilder().addComponents(data);

        // < Adiciona os campos ao modal >
        modal.addComponents(crianca_campo, mae_campo, pai_campo, data_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};