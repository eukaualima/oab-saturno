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
	id: "btn_prova_experiencia_sim",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Retira as opções da resposta anterior e salva a resposta do usuário >
        interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 1.0\n> Tem **experiência** como **advogado(a)** em RP?\n> **Resposta:** Sim.`, components: [] });

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_1 = 'Sim'`);

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

        // < Informe >
        await interaction.channel.send({ content: `<:oab_relogio:1204997699586236436> **|** ${interaction.member}, questão 1.1 em **5 segundos**...` });

        // < Pergunta #1 >
        setTimeout(async () => {
            // < Pergunta #1 >
            await interaction.channel.send({ content: `## <:oab_questao:1204999334853214260> Questão 1.1\n> Qual o horário que você irá trabalhar caso seja contratado?`, components: [botoes] });
        }, 5000);
    },
};