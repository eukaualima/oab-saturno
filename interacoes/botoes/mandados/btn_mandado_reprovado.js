/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, Collection, PermissionsBitField, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const pool = require('../../../conexao/mysql');
const { cargo_juiz, cargo_juiz_mandado } = require('../../../config.json');

// < Inicia o botão >
module.exports = 
{
	id: "btn_mandado_rejeitado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz_mandado))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem avaliar e dar o veredito sobre o mandado.`, ephemeral: true })
        }

        // < Cria o modal de rejeição do processo >
        const modal = new ModalBuilder()
        .setCustomId("mdl_mandado_reprovado")
        .setTitle('Indeferir Mandado')

        // < Cria os campos >
        const motivo = new TextInputBuilder()
            .setCustomId('motivo_reprovacao')
            .setLabel("Observações:")
            .setPlaceholder("(Exemplo) ID não condiz.")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const codigo = new TextInputBuilder()
            .setCustomId('codigo_mandado')
            .setLabel("Código do mandado (NÃO MODIFICAR):")
            .setValue(`${interaction.channel.name.split(" ")[2]}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const motivo_campo = new ActionRowBuilder().addComponents(motivo);
        const codigo_campo = new ActionRowBuilder().addComponents(codigo);

        // < Adiciona os campos ao modal >
        modal.addComponents(motivo_campo, codigo_campo);
        
        // < Mostra o modal >
        interaction.showModal(modal);
    },
};