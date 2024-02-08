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
	id: "slc_prova_questao_25",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_lei_de_miranda_calado") resposta = "É obrigado a ficar calado";
        if (interaction.values[0] == "prova_lei_de_miranda_ligacao") resposta = "Pode realizar uma única ligação para o advogado";
        if (interaction.values[0] == "prova_lei_de_miranda_familiares") resposta = "Somente pode falar com familiares";
        if (interaction.values[0] == "prova_lei_de_miranda_dizer") resposta = "Tudo que ele disser, não será levado como prova";

        // < Retira as opções da resposta anterior e salva a resposta do usuário >
        interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.5\n> Sobre a Lei de Miranda, o réu:\n> **Resposta:** ${resposta}.`, components: [] });

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_11 = '${resposta}'`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_26')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Verdadeiro')
                .setEmoji('1️⃣')
                .setValue('prova_lei_de_miranda_verdade'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Falso')
                .setEmoji('2️⃣')
                .setValue('prova_lei_de_miranda_falso'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        // < Informe >
        await interaction.channel.send({ content: `<:oab_relogio:1204997699586236436> **|** ${interaction.member}, questão 2.6 em **5 segundos**...` });

        // < Pergunta #1 >
        setTimeout(async () => {
            // < Pergunta #1 >
            await interaction.channel.send({ content: `## <:oab_questao:1204999334853214260> Questão 2.6\n> A polícia não é obrigada a citar a Lei de Miranda.`, components: [row] });
        }, 5000);
    },
};