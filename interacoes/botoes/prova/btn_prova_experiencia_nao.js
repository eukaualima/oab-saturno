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
	id: "btn_prova_experiencia_nao",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_1 = 'Não'`);
        
        // < Registra os pontos >
        pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
        {
            pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1)`);
        })

        // < Respostas >
        const btn_prova_manha = new ButtonBuilder()
        .setCustomId('btn_prova_manha')
        .setLabel(`Manhã`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`🏙️`);
        
        const btn_prova_tarde = new ButtonBuilder()
        .setCustomId('btn_prova_tarde')
        .setLabel(`Tarde`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`🌇`);
        
        const btn_prova_noite = new ButtonBuilder()
        .setCustomId('btn_prova_noite')
        .setLabel(`Noite`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`🌃`);

        const botoes = new ActionRowBuilder()
        .addComponents(btn_prova_manha, btn_prova_tarde, btn_prova_noite);

        await interaction.update({ content: `# <:oab_livro:1204999345544372264> Parte 1 - Questões pessoais\n## <:oab_questao:1204999334853214260> Questão 1.1\n> Qual o horário que você irá trabalhar caso seja contratado?`, components: [botoes] });
    },
};