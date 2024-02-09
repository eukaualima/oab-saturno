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
	id: "btn_adocoes",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_adocao")
        .setTitle('Audiência de Adoção')

        // < Cria os campos >
        const crianca = new TextInputBuilder()
            .setCustomId('adocao_nome')
            .setLabel("Nome da/do criança/adulto e ID:")
            .setPlaceholder("Nome completo e passaporte da criança/adulto.")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const mae = new TextInputBuilder()
            .setCustomId('adocao_mae')
            .setLabel("Nome da mãe e ID:")
            .setPlaceholder("Nome completo e passaporte da mãe (caso tenha)")
            .setStyle(TextInputStyle.Short);
        const pai = new TextInputBuilder()
            .setCustomId('adocao_pai')
            .setLabel("Nome do pai e ID:")
            .setPlaceholder("Nome completo e passaporte do pai (caso tenha)")
            .setStyle(TextInputStyle.Short);
        const data = new TextInputBuilder()
            .setCustomId('adocao_data')
            .setLabel("Data da adoção:")
            .setPlaceholder("Ex.: 26 de dezembro de 2023")
            .setStyle(TextInputStyle.Short);
        
        const disponibilidade = new TextInputBuilder()
            .setCustomId('adocao_disponibilidade')
            .setLabel("Disponibilidade de horário dos pais:")
            .setPlaceholder("Ex.: A partir das 22h, quartas e quintas")
            .setStyle(TextInputStyle.Short);
        
        const crianca_campo = new ActionRowBuilder().addComponents(crianca);
        const mae_campo = new ActionRowBuilder().addComponents(mae);
        const pai_campo = new ActionRowBuilder().addComponents(pai);
        const data_campo = new ActionRowBuilder().addComponents(data);
        const disponibilidade_campo = new ActionRowBuilder().addComponents(disponibilidade);

        // < Adiciona os campos ao modal >
        modal.addComponents(crianca_campo, mae_campo, pai_campo, data_campo, disponibilidade_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};