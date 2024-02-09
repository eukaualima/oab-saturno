/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "btn_prova_continuar",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_5 = 'Continuou a prova' WHERE discord_id = ${interaction.user.id}`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_20')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Sim')
                .setEmoji('1187428122988126348')
                .setDescription('É permitido.')
                .setValue('prova_matar_permitido'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Não')
                .setEmoji('1187428311014576208')
                .setDescription('Não é permitido.')
                .setValue('prova_matar_nao'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Talvez')
                .setEmoji('1204999334853214260')
                .setDescription('Talvez seja permitido.')
                .setValue('prova_matar_talvez'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.update({ content: `# <:oab_livro:1204999345544372264> Parte 2 - Regras da Cidade\n## <:oab_questao:1204999334853214260> Questão 2.0\n> Matar alguém sem motivo aparente, sem rp prévio ou simplesmente por prazer é permitido em Saturno?`, components: [row] });
    },
};