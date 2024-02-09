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
	id: "slc_prova_questao_26",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_lei_de_miranda_verdade")
        {
            resposta = "Verdadeiro";
        }
        else if (interaction.values[0] == "prova_lei_de_miranda_falso")
        {
            resposta = "Falso";

            // < Registra os pontos >
            pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
            {
                pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1) WHERE discord_id = ${interaction.user.id}`);
            })
        }

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_12 = '${resposta}' WHERE discord_id = ${interaction.user.id}`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_27')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('O advogado somente terá que respeitar')
                .setDescription('a confidencialidade após o pagamento')
                .setEmoji('1️⃣')
                .setValue('prova_adv_respeitar'),
            new StringSelectMenuOptionBuilder()
                .setLabel('O advogado poderá revelar a confissão')
                .setDescription('do réu caso esteja errado e mereça ser preso')
                .setEmoji('2️⃣')
                .setValue('prova_adv_preso'),
            new StringSelectMenuOptionBuilder()
                .setLabel('O advogado não pode revelar a confissão do réu')
                .setEmoji('3️⃣')
                .setValue('prova_adv_confissao'),
            new StringSelectMenuOptionBuilder()
                .setLabel('O advogado não pode revelar a confissão')
                .setDescription('do réu à polícia, apenas a parentes e amigos')
                .setEmoji('4️⃣')
                .setValue('prova_adv_amigos'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.7\n> Referente à confidencialidade do réu com seu advogado(a), assinale a alternativa correta:`, components: [row] });
    },
};