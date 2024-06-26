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
const { cargo_juiz, forum_processos, cargo_everyone, categoria_limpezas, footer, cor_embed } = require('../../../config.json');
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
        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\n<a:oab_carregando:1187884300264275968> Aguarde a criação do seu **processo**...`, ephemeral: true });

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
                
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.nickname, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`Processo de **Limpeza de Ficha Criminal Nº${total_registros+1}**.\n* Dr(a). ${interaction.user} (OAB: ${servidores[0].passaporte})`)
                .setColor(cor_embed)
                .addFields([
                    { name: `<:oab_reu:1187577589448060989> | Réu`, value: `\`\`\`txt\n${reu_nome}\`\`\``, inline: true },
                    { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `\`\`\`js\n${reu_id}\`\`\``, inline: true },
                    { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                    { name: `<:oab_algemas:1188269430388559892> | Meses`, value: `${meses}`, inline: true },
                    { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ ${honorarios_totais.toLocaleString('pt-BR')},00`, inline: true },
                ])
                .setThumbnail(interaction.user.avatarURL({ size: 2048, dynamic: true }))
                .setFooter({ text: footer, iconURL: client.user.avatarURL() });
                
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

                // < Busca o fórum de processos >
                const channel = client.channels.cache.get(forum_processos);

                channel.threads.create(
                {
                    name: `Limpeza Nº ${total_registros+1} | Dr(a). ${(interaction.member.nickname).replace(/(\d+|\|)/g, "")}`, 
                    message: { embeds: [embed], components: [botao] }, 
                    type: ChannelType.PrivateThread 
                }) 
                .then(async thread => 
                {
                    // < Cria os dados no banco de dados >
                    pool.query(`INSERT INTO limpezas (advogado, juiz, reu, reu_id, meses, orcamento, data, status, observacoes) VALUES ("${interaction.user.id}", "Ninguém", "${reu_nome}", ${reu_id}, ${meses}, ${honorarios_totais}, NOW(), "Aberto", "Nenhuma")`);
                    
                    await thread.members.add(interaction.user.id);
                    await thread.send({ content: `## <:oab_aviso:1188557292073918555> Anexos\n${interaction.user}, envie abaixo:\n1. **Comprovante da transferência** feita ao(à) Juiz(a) responsável; e\n2. imagem da **pesquisa no MDT**.\n\n* Ao enviar, **marque o cargo Juiz(a)** e aguarde o retorno.` });
                    await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\nSeu processo de **Limpeza de Ficha** (ID: ${total_registros+1}) foi aberto com sucesso! Acesse em: <#${thread.id}>.`, ephemeral: true });
                })
            })
        })
    },
};