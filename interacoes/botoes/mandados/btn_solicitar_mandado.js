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
	id: "btn_solicitar_mandado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Cria o modal de rejeição do processo >
        const modal = new ModalBuilder()
        .setCustomId("mdl_solicitar_mandado")
        .setTitle('Solicitar Mandado')

        // < Cria os campos >
        const nome = new TextInputBuilder()
            .setCustomId('mandado_nome')
            .setLabel("Nome:")
            .setPlaceholder("Nome completo do acusado")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const passaporte = new TextInputBuilder()
            .setCustomId('mandado_passaporte')
            .setLabel("Passaporte:")
            .setPlaceholder("1234")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const rg = new TextInputBuilder()
            .setCustomId('mandado_rg')
            .setLabel("RG:")
            .setPlaceholder("12ABC345")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
    
        const idade = new TextInputBuilder()
        .setCustomId('mandado_idade')
        .setLabel("Idade:")
        .setPlaceholder("23")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
        
        const delitos = new TextInputBuilder()
        .setCustomId('mandado_delitos')
        .setLabel("Delito(s) (APENAS OS ARTIGOS):")
        .setPlaceholder("1, 2, 3, 4")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

        const nome_campo = new ActionRowBuilder().addComponents(nome);
        const passaporte_campo = new ActionRowBuilder().addComponents(passaporte);
        const rg_campo = new ActionRowBuilder().addComponents(rg);
        const idade_campo = new ActionRowBuilder().addComponents(idade);
        const delitos_campo = new ActionRowBuilder().addComponents(delitos);

        // < Adiciona os campos ao modal >
        modal.addComponents(nome_campo, passaporte_campo, rg_campo, idade_campo, delitos_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};