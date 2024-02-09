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
	id: "slc_prova_questao_20",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_matar_permitido")
        {
            resposta = "Sim";
        }
        else if (interaction.values[0] == "prova_matar_nao") 
        {
            resposta = "Não";
            
            // < Registra os pontos >
            pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
            {
                pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1)`);
            })
        }
        else if (interaction.values[0] == "prova_matar_talvez") 
        {
            resposta = "Talvez";
        }

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_6 = '${resposta}'`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_21')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Sim')
                .setEmoji('1187428122988126348')
                .setValue('prova_matar_permitido'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Não')
                .setEmoji('1187428311014576208')
                .setValue('prova_matar_nao'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Talvez')
                .setEmoji('1204999334853214260')
                .setValue('prova_matar_talvez'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.update({ content: `# <:oab_livro:1204999345544372264> Parte 2 - Regras da Cidade\n## <:oab_questao:1204999334853214260> Questão 2.1\n> O advogado(a) pode ter condutas desrespeitosas como LGBTfobia, Racismo ou Xenofobia com um cliente ou outro colega de trabalho (ou quaisquer players)?`, components: [row] });
    },
};