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
	id: "slc_prova_questao_28",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_policia_verdade") resposta = "Verdadeiro";
        if (interaction.values[0] == "prova_policia_falso") resposta = "Falso";

        // < Retira as opções da resposta anterior e salva a resposta do usuário >
        interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.8\n> A polícia é obrigada a negociar a pena do réu que solicitou advogado?\n> **Resposta:** ${resposta}.`, components: [] });

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_14 = '${resposta}'`);

        // < Informe >
        await interaction.channel.send({ content: `<a:oab_carregando:1187884300264275968> **|** ${interaction.member} estou **salvando** a sua prova...` })
        .then(msg => 
        {
            // < Pergunta #1 >
            setTimeout(async () => {
                // < Pergunta #1 >
                await msg.edit({ content: `# <:oab_livro:1204999345544372264> Prova encerada\n${interaction.member}, sua prova foi **salva** com sucesso.\n* Aguarde o retorno do(a) Juiz(a) responsável.` });
            }, 5000);
        })
    },
};