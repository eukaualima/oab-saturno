/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { Permissions, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "btn_prova_discordo_regras",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_4 = 'Discordo das regras' WHERE discord_id = ${interaction.user.id}`);

        // < Respostas >
        const btn_prova_continuar = new ButtonBuilder()
        .setCustomId('btn_prova_continuar')
        .setLabel(`Continuar`)
        .setStyle(ButtonStyle.Success)
        .setEmoji(`1205008167071907870`);
        
        const btn_prova_link = new ButtonBuilder()
        .setLabel('Regras Saturno RP')
        .setURL('https://docs.google.com/document/d/1SiInMRcjngSfvuLGkAoV_k0LQt6plPUlXexZq5Yc--s/edit#heading=h.gyfzrx8z729i')
        .setEmoji('1188266116770975744')
        .setStyle(ButtonStyle.Link);

        const botoes = new ActionRowBuilder()
        .addComponents(btn_prova_continuar, btn_prova_link);

        await interaction.update({ content: `# <:oab_livro:1204999345544372264> Parte 1 - Questões pessoais\n## <:oab_fechado:1187577601489903728> Fim da Parte 1\n> Próxima etapa será um pequeno teste sobre as **regras básicas de Saturno**. Por gentileza, **leia as regras básicas da cidade** (encontram-se no item 3 da regra geral - clique no botão de link)!`, components: [botoes] });
    },
};