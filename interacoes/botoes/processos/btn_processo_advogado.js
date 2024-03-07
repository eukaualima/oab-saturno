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
	id: "btn_processo_advogado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem alterar o(a) advogado(a) caso.`, ephemeral: true })
        }

        // < Cria o modal de rejeição do processo >
        const modal = new ModalBuilder()
        .setCustomId("mdl_processo_advogado")
        .setTitle('Alterar advogado(a)')

        // < Cria os campos >
        const advogado = new TextInputBuilder()
        .setCustomId('advogado_novo')
        .setLabel("Passaporte do(a) novo(a) advogado(a):")
        .setPlaceholder("123")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

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

        const advogado_campo = new ActionRowBuilder().addComponents(advogado);
        const codigo_campo = new ActionRowBuilder().addComponents(codigo);
        const natureza_campo = new ActionRowBuilder().addComponents(natureza);

        // < Adiciona os campos ao modal >
        modal.addComponents(advogado_campo, natureza_campo, codigo_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};