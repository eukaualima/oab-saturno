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
	id: "btn_mudanca_nome",

    // < Executa o código do botão >
	async execute(interaction) 
    {
        // < Cria o modal >
        const modal = new ModalBuilder()
        .setCustomId("mdl_mudar_nome")
        .setTitle('Mudança de nome')

        // < Cria os campos >
        const nome_antigo = new TextInputBuilder()
            .setCustomId('mudar_nome_antigo')
            .setLabel("Nome antigo:")
            .setPlaceholder("Nome atual completo do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const nome_novo = new TextInputBuilder()
            .setCustomId('mudar_nome_novo')
            .setLabel("Novo nome:")
            .setPlaceholder("Nome completo que seu cliente deseja")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const passaporte = new TextInputBuilder()
            .setCustomId('mudar_nome_passaporte')
            .setLabel("Passaporte:")
            .setPlaceholder("Passaporte do seu cliente")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const motivo = new TextInputBuilder()
            .setCustomId('mudar_nome_motivo')
            .setLabel("Motivo:")
            .setPlaceholder("Motivo da troca de nome")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const nome_antigo_campo = new ActionRowBuilder().addComponents(nome_antigo);
        const nome_novo_campo = new ActionRowBuilder().addComponents(nome_novo);
        const passaporte_campo = new ActionRowBuilder().addComponents(passaporte);
        const motivo_campo = new ActionRowBuilder().addComponents(motivo);

        // < Adiciona os campos ao modal >
        modal.addComponents(nome_antigo_campo, nome_novo_campo, passaporte_campo, motivo_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};