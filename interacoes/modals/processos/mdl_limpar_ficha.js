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
const { cargo_juiz, cargo_everyone, categoria_limpezas, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

function honorarios(meses)
{
    if (meses <= 12)
    {
        return 50000;
    }
    else
    {
        return meses * 4000;
    }
}

// < Inicia o botão >
module.exports = 
{
	id: "mdl_limpar_ficha",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const reu_nome = interaction.fields.getTextInputValue('limpar_ficha_reu_nome')
        const reu_id = interaction.fields.getTextInputValue('limpar_ficha_reu_id')
        const meses = interaction.fields.getTextInputValue('limpar_ficha_meses')

        // < Calcula os honorários >
        const honorarios_totais = honorarios(meses);

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `## <a:oab_carregando:1187884300264275968> Aguarde...\nEstou criando o **canal** do processo!`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM limpezas`, async function (erro, limpezas)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo Limpezas de Ficha >
                let total_registros = limpezas[0].total_registros;
                
                // < Cria um novo canal para o processo >
                interaction.guild.channels.create(
                    { 
                        name: `limpeza-${total_registros+1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_limpezas,
                        permissionOverwrites: 
                        [
                            {
                                id: cargo_juiz,
                                allow: [ViewChannel, SendMessages, AttachFiles]
                            },
                            {
                                id: interaction.user.id,
                                allow: [ViewChannel, SendMessages, AttachFiles]
                            },
                            {
                                id: cargo_everyone,
                                deny: [ViewChannel, SendMessages, AttachFiles]
                            }
                        ]
                    }).then(async canal => 
                    {
                        const embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setDescription(`Processo de Limpeza de Ficha Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                        .setColor(cor_embed)
                        .addFields([
                            { name: `<:oab_reu:1187577589448060989> | Réu`, value: `${reu_nome}`, inline: true },
                            { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `${reu_id}`, inline: true },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_algemas:1188269430388559892> | Meses`, value: `${meses}`, inline: true },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ ${honorarios_totais.toLocaleString('pt-BR')},00`, inline: true },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO limpezas (advogado, juiz, reu, reu_id, meses, orcamento, data, status, observacoes) VALUES ("${interaction.user.id}", "Ninguém", "${reu_nome}", ${reu_id}, ${meses}, ${honorarios_totais}, NOW(), "Aberto", "Nenhuma")`);

                        await interaction.editReply({ content: `## <:oab_check:1187428122988126348> Sucesso!\n${interaction.user}, seu processo de **Limpeza de Ficha** (ID: ${total_registros+1}) foi aberto com sucesso no canal <#${canal.id}>.`, ephemeral: true });
                        
                        // < Cria os botões >
                        const btn_processo_aprovado = new ButtonBuilder()
                        .setCustomId('btn_processo_aprovado')
                        .setLabel(`Deferir processo`)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_rejeitado = new ButtonBuilder()
                        .setCustomId('btn_processo_rejeitado')
                        .setLabel(`Indeferir processo`)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_assumir = new ButtonBuilder()
                        .setCustomId('btn_processo_assumir')
                        .setLabel(`Avocar processo`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`1187577598776193136`);

                        const botao = new ActionRowBuilder()
                        .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);

                        await canal.send({ embeds: [embed], components: [botao] });
                        await canal.send({ content: `### <:oab_aviso:1188557292073918555> Anexos\n${interaction.user}, envie abaixo:\n1. **Comprovante da transferência** feita ao(à) Juiz(a) responsável; e\n2. imagem da **pesquisa no MDT**.\n\n* Ao enviar, **marque o cargo Juiz(a)** e aguarde o retorno.` });
                        
                    })
            })
        })
    },
};