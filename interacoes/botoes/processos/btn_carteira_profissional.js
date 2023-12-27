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
	id: "btn_carteira_profissional",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_carteira_profissional")
        .setTitle('Carteira Profissional')

        // < Cria os campos >
        const nome = new TextInputBuilder()
            .setCustomId('carteira_nome')
            .setLabel("Nome:")
            .setPlaceholder("Nome do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const id = new TextInputBuilder()
            .setCustomId('carteira_id')
            .setLabel("Passaporte:")
            .setPlaceholder("Passaporte do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const profissao = new TextInputBuilder()
            .setCustomId('carteira_profissao')
            .setLabel("Profissão:")
            .setPlaceholder("Profissão do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const rg = new TextInputBuilder()
            .setCustomId('carteira_rg')
            .setLabel("RG:")
            .setPlaceholder("Licença que pode ser vista no F11")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const nome_campo = new ActionRowBuilder().addComponents(nome);
        const id_campo = new ActionRowBuilder().addComponents(id);
        const profissao_campo = new ActionRowBuilder().addComponents(profissao);
        const rg_campo = new ActionRowBuilder().addComponents(rg);

        // < Adiciona os campos ao modal >
        modal.addComponents(nome_campo, id_campo, profissao_campo, rg_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};