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
	id: "slc_prova_questao_27",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;

        // < Verifica a entrada >
        if (interaction.values[0] == "prova_adv_respeitar")
        {
            resposta = "O advogado somente terá que respeitar a confidencialidade após o pagamento";
        }
        else if (interaction.values[0] == "prova_adv_preso")
        {
            resposta = "O advogado poderá revelar a confissão do réu caso esteja errado e mereça ser preso";
        }
        else if (interaction.values[0] == "prova_adv_amigos")
        {
            resposta = "O advogado não pode revelar a confissão do réu";

            // < Registra os pontos >
            pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
            {
                pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1)`);
            })
        }
        else if (interaction.values[0] == "prova_adv_confissao")
        {
            resposta = "O advogado não pode revelar a confissão do réu à polícia, apenas a parentes e amigos";
        }

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_13 = '${resposta}'`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_28')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Verdadeiro')
                .setEmoji('1️⃣')
                .setValue('prova_policia_verdade'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Falso')
                .setEmoji('2️⃣')
                .setValue('prova_policia_falso'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.8\n> A polícia é obrigada a negociar a pena do réu que solicitou advogado?`, components: [row] });
    },
};