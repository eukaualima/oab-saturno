/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { cargo_juiz, cargo_everyone, categoria_certidao, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_casamento",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const noiva = interaction.fields.getTextInputValue('casamento_noiva')
        const noivo = interaction.fields.getTextInputValue('casamento_noivo')
        const testemunhas = interaction.fields.getTextInputValue('casamento_testemunhas')
        const data = interaction.fields.getTextInputValue('casamento_data')

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM casamentos`, async function (erro, casamentos)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo casamentos >
                let total_registros = casamentos[0].total_registros;
                
                // < Cria um novo canal para o processo >
                interaction.guild.channels.create(
                    { 
                        name: `casamento-${total_registros+1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_certidao,
                        permissionOverwrites: 
                        [
                            {
                                id: cargo_juiz,
                                allow: [ViewChannel, SendMessages]
                            },
                            {
                                id: interaction.user.id,
                                allow: [ViewChannel, SendMessages]
                            },
                            {
                                id: cargo_everyone,
                                deny: [ViewChannel, SendMessages]
                            }
                        ]
                    }).then(canal => 
                    {
                        const embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setDescription(`Processo de Casamento Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                        .setColor(cor_embed)
                        .addFields([
                            { name: `<:oab_noiva:1189409204834943066> | Noiva`, value: `${noiva}`, inline: true },
                            { name: `<:oab_noivo:1189409201995382805> | Noivo`, value: `${noivo}`, inline: true },
                            { name: `<:oab_testemunhas:1188556234551464026> | Testemunhas`, value: `${testemunhas}`, inline: true },
                            { name: `<:oab_data:1188268177063424050> | Data do casamento`, value: `${data}` },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 1.250.000,00`, inline: true },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO casamentos (advogado, juiz, noiva, noivo, testemunhas, data_casamento, data_abertura, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", "${noiva}", "${noivo}", "${testemunhas}", "${data}", NOW(), "Aberto", "Nenhuma")`);
                        
                        // < Cria os botões >
                        const btn_processo_aprovado = new ButtonBuilder()
                        .setCustomId('btn_processo_aprovado')
                        .setLabel(`Aprovar processo`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_rejeitado = new ButtonBuilder()
                        .setCustomId('btn_processo_rejeitado')
                        .setLabel(`Rejeitar processo`)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_assumir = new ButtonBuilder()
                        .setCustomId('btn_processo_assumir')
                        .setLabel(`Assumir processo`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`1187577598776193136`);

                        const botao = new ActionRowBuilder()
                        .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);

                        canal.send({ embeds: [embed], components: [botao] });
                        canal.send({ content: `<:oab_aviso:1188557292073918555> **|** ${interaction.user}, envie as prints da transferência bancária feita para o(a) Juiz(a).` });
                        interaction.reply({ content: `<:oab_check:1187428122988126348> **|** Processo de Casamento Nº${total_registros+1} aberto com sucesso! Acesso-o no canal <#${canal.id}>.`, ephemeral: true });
                    })
            })
        })
    },
};