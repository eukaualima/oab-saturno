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
        if (interaction.values[0] == "prova_adv_respeitar") resposta = "O advogado somente terá que respeitar a confidencialidade após o pagamento";
        if (interaction.values[0] == "prova_adv_preso") resposta = "O advogado poderá revelar a confissão do réu caso esteja errado e mereça ser preso";
        if (interaction.values[0] == "prova_adv_amigos") resposta = "O advogado não pode revelar a confissão do réu";
        if (interaction.values[0] == "prova_adv_confissao") resposta = "O advogado não pode revelar a confissão do réu à polícia, apenas a parentes e amigos";

        // < Retira as opções da resposta anterior e salva a resposta do usuário >
        interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.7\n> Referente à confidencialidade do réu com seu advogado(a), assinale a alternativa correta:\n> **Resposta:** ${resposta}.`, components: [] });

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

        // < Pergunta #1 >
        await interaction.channel.send({ content: `<:oab_relogio:1204997699586236436> **|** ${interaction.member}, questão 2.8 em **5 segundos**...` });

        // < Pergunta #1 >
        setTimeout(async () => {
            // < Pergunta #1 >
            await interaction.channel.send({ content: `## <:oab_questao:1204999334853214260> Questão 2.8\n> A polícia é obrigada a negociar a pena do réu que solicitou advogado?`, components: [row] });
        }, 5000);
    },
};