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
	id: "btn_prova",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_prova")
        .setTitle('Prova da OAB')

        // < Cria os campos >
        const passaporte = new TextInputBuilder()
            .setCustomId('prova_passaporte')
            .setLabel("Qual seu passaporte?")
            .setPlaceholder("1234")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const nome = new TextInputBuilder()
            .setCustomId('prova_nome')
            .setLabel("Qual seu nome?")
            .setPlaceholder("John Doe")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const numero = new TextInputBuilder()
            .setCustomId('prova_numero')
            .setLabel("Qual seu telefone?")
            .setPlaceholder("123-456")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
            
        const idade = new TextInputBuilder()
            .setCustomId('prova_idade')
            .setLabel("Qual sua idade em Nárnia?")
            .setPlaceholder("20")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const passaporte_campo = new ActionRowBuilder().addComponents(passaporte);
        const nome_campo = new ActionRowBuilder().addComponents(nome);
        const numero_campo = new ActionRowBuilder().addComponents(numero);
        const idade_campo = new ActionRowBuilder().addComponents(idade);

        // < Adiciona os campos ao modal >
        modal.addComponents(passaporte_campo, nome_campo, numero_campo, idade_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};