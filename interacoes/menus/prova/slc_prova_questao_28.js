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

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_14 = '${resposta}'`);

        // < Informe >
        await interaction.update({ content: `# <a:oab_carregando:1187884300264275968> Salvando a prova...\n* Aguarde enquanto eu registro suas respostas.`, components: [] })
        .then(msg => 
        {
            // < Pergunta #1 >
            setTimeout(async () => {
                // < Pergunta #1 >
                await msg.edit({ content: `# <:oab_livro:1204999345544372264> Prova encerada\n* Aguarde o retorno do(a) Juiz(a) responsável.` });
            }, 5000);
        })
    },
};