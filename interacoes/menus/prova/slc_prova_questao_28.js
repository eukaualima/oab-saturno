/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_resultados, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "slc_prova_questao_28",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        const { ViewChannel, SendMessages, AttachFiles, CreatePublicThreads, CreatePrivateThreads } = PermissionFlagsBits;

        let resposta;
        
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_policia_verdade")
        {
            resposta = "Verdadeiro";

            // < Registra os pontos >
            pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
            {
                pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1)`);
            })
        } 
        else if (interaction.values[0] == "prova_policia_falso")
        {
            resposta = "Falso";
        }

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_14 = '${resposta}'`);

        // < Informe >
        await interaction.update({ content: `# <a:oab_carregando:1187884300264275968> Salvando a prova...\n* Aguarde enquanto eu registro suas respostas.`, components: [] })
        .then(async msg => 
        {
            // < Pergunta #1 >
            setTimeout(async () => {
                // < Pergunta #1 >
                await msg.edit({ content: `# <:oab_livro:1204999345544372264> Prova encerada\n* Aguarde o retorno do(a) Juiz(a) responsável no canal <#${canal_resultados}>.` });
            }, 5000);

            pool.query(`SELECT COUNT(*) AS total_provas FROM provas`, async function (erro, provas_total)
            {
                await interaction.guild.channels.create(
                    { 
                        name: `análise-${provas_total[0].total_provas + 1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_prova,
                        permissionOverwrites: 
                        [
                            {
                                id: cargo_juiz,
                                allow: [ViewChannel, SendMessages, AttachFiles]
                            },
                            {
                                id: cargo_everyone,
                                deny: [ViewChannel, SendMessages, AttachFiles]
                            }
                        ]
                    }).then(async canal => 
                    {
                        pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
                        {
                            // < Cria os botões >
                            const btn_prova_aprovada = new ButtonBuilder()
                            .setCustomId('btn_prova_aprovado')
                            .setLabel(`Aprovar candidato(a)`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`1187577594472837171`);

                            const btn_prova_rejeitada = new ButtonBuilder()
                            .setCustomId('btn_prova_rejeitado')
                            .setLabel(`Rejeitar candidato(a)`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`1187577594472837171`);

                            const botao = new ActionRowBuilder()
                            .addComponents(btn_prova_aprovada, btn_prova_rejeitada);

                            await canal.send({ content: `# <:oab_livro:1204999345544372264> Prova de ${provas[0].nome}\n<:oab_passaporte:1188496362334072882> Passaporte: ${provas[0].passaporte}\n<:oab_celular:1204990954277445643> Contato: ${provas[0].numero}\n<:oab_idade:1204991690151165962> Idade em Nárnia: ${provas[0].idade}\n<:oab_logo:1202096934093852732> Respostas corretas: **${provas[0].pontos}**/12\n\n<@&1106408610000543834>`, components: [botao] })
                        })
                    })
            })
        })
    },
};