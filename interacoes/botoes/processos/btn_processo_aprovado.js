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
	id: "btn_processo_aprovado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem avaliar e dar o veredito sobre o caso.`, ephemeral: true })
        }

        // < Cria o modal de rejeição do processo >
        const modal = new ModalBuilder()
        .setCustomId("mdl_processo_aprovado")
        .setTitle('Aprovação de processo')

        // < Cria os campos >
        const motivo = new TextInputBuilder()
            .setCustomId('motivo_aprovacao')
            .setLabel("Motivo (opcional):")
            .setPlaceholder("Por que o processo foi aprovado?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const natureza = new TextInputBuilder()
            .setCustomId('natureza_processo')
            .setLabel("Natureza do processo (NÃO MODIFICAR):")
            .setValue(`${interaction.channel.name.replace(/[^a-zA-Z]/g,'') + 's'}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const codigo = new TextInputBuilder()
            .setCustomId('codigo_processo')
            .setLabel("Código do processo (NÃO MODIFICAR):")
            .setValue(`${interaction.channel.name.replace(/[^0-9]/g,'')}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const motivo_campo = new ActionRowBuilder().addComponents(motivo);
        const codigo_campo = new ActionRowBuilder().addComponents(codigo);
        const natureza_campo = new ActionRowBuilder().addComponents(natureza);

        // < Adiciona os campos ao modal >
        modal.addComponents(motivo_campo, natureza_campo, codigo_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};