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
	id: "mdl_prova",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles, CreatePublicThreads, CreatePrivateThreads } = PermissionFlagsBits;

        // < Verifica se ele tem alguma prova em análise >
        pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
        {
            if (provas.length == 0 || provas[0].resultado == "Reprovado(a)")
            {
                // < Coleta as informações passadas no modal >
                const passaporte = interaction.fields.getTextInputValue('prova_passaporte');
                const nome = interaction.fields.getTextInputValue('prova_nome');
                const numero = interaction.fields.getTextInputValue('prova_numero');
                const idade = interaction.fields.getTextInputValue('prova_idade');

                // < Abre o canal da prova >
                await interaction.guild.channels.create(
                { 
                    name: `prova-${nome}`,
                    type: ChannelType.GuildText,
                    parent: categoria_prova,
                    permissionOverwrites: 
                    [
                        {
                            id: cargo_juiz,
                            allow: [ViewChannel, SendMessages, AttachFiles]
                        },
                        {
                            id: interaction.user.id,
                            allow: [ViewChannel],
                            deny: [AttachFiles, SendMessages, CreatePrivateThreads, CreatePublicThreads]
                        },
                        {
                            id: cargo_everyone,
                            deny: [ViewChannel, SendMessages, AttachFiles]
                        }
                    ]
                }).then(async canal => 
                {
                    // < Cria os dados no banco de dados >
                    pool.query(`INSERT INTO provas (discord_id, nome, passaporte, numero, idade, resposta_1, resposta_2, resposta_3, resposta_4, resposta_5, resposta_6, resposta_7, resposta_8, resposta_9, resposta_10, resposta_11, resposta_12, resposta_13, resposta_14, resultado, juiz) VALUES (${interaction.user.id}, "${nome}", "${passaporte}", "${numero}", "${idade}", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Nada consta.", "Em análise", "Ninguém")`);
                    
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Prova iniciada com sucesso! Acesse-a no canal <#${canal.id}>.`, ephemeral: true });

                    // < A prova >
                    const btn_prova_experiencia_sim = new ButtonBuilder()
                    .setCustomId('btn_prova_experiencia_sim')
                    .setLabel(`Sim`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`1187428122988126348`);

                    const btn_prova_experiencia_nao = new ButtonBuilder()
                    .setCustomId('btn_prova_experiencia_nao')
                    .setLabel(`Não`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`1187428311014576208`);

                    const botoes = new ActionRowBuilder()
                    .addComponents(btn_prova_experiencia_sim, btn_prova_experiencia_nao);

                    // < Informe >
                    await canal.send({ content: `# <:oab_livro:1204999345544372264> Parte 1 - Questões pessoais\n## <:oab_questao:1204999334853214260> Questão 1.0\n> Tem **experiência** como **advogado(a)** em RP?`, components: [botoes] });
                })
            }
            else
            {
                if (provas[0].resultado == "Em análise")
                {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Prova em análise\n${interaction.member}, em nosso sistema consta que você já possui uma prova **em análise**. Aguarde o retorno do(a) Juiz(a) e caso seja **reprovado(a)**, você poderá fazer novamente quantas vezes quiser.` });
                }
                else if (provas[0].resultado == "Aprovado(a)")
                {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Prova aprovada\n${interaction.member}, em nosso sistema consta que você já possui uma prova **aprovada**. Aguarde o contato do(a) Juiz(a) aqui no e-mail ou na cidade, caso ainda não tenha ocorrido.` });
                }
            }
        })
    },
};