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
const { cargo_juiz, cargo_everyone, forum_mandados, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_solicitar_mandado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const nome = interaction.fields.getTextInputValue('mandado_nome')
        const passaporte = interaction.fields.getTextInputValue('mandado_passaporte')
        const rg = interaction.fields.getTextInputValue('mandado_rg')
        const idade = interaction.fields.getTextInputValue('mandado_idade')
        const delitos = interaction.fields.getTextInputValue('mandado_delitos')

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Solicitação de Mandado de Prisão\n<a:oab_carregando:1187884300264275968> Aguarde a criação do seu **Mandado**...`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM mandados`, async function (erro, audiencias)
        {
            // < Coleta o total de processos do tipo audiencias >
            let total_registros = audiencias[0].total_registros;
            
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`Mandado de Prisão Nº${total_registros+1} aberto com sucesso.\n* Elaborado por ${interaction.user}`)
            .setColor(cor_embed)
            .addFields([
                { name: `<:oab_reu:1187577589448060989> | Nome`, value: `\`\`\`txt\n${nome}\`\`\``, inline: true },
                { name: `<:oab_id:1189405031515029615> | Passaporte`, value: `\`\`\`txt\n${passaporte}\`\`\``, inline: true },
                { name: `<:oab_id:1189405031515029615> | RG`, value: `\`\`\`txt\n${rg}\`\`\``, inline: true },
                { name: `<:oab_idade:1204991690151165962> | Idade`, value: `\`\`\`txt\n${idade}\`\`\``, inline: true },
                { name: `<:oab_algemas:1188269430388559892> | Delitos`, value: `\`\`\`txt\n${delitos}\`\`\``, inline: true },
                { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
            ])
            .setThumbnail(interaction.user.avatarURL())
            .setFooter({ text: footer, iconURL: client.user.avatarURL() });
            
            // < Cria os botões >
            const btn_mandado_aprovado = new ButtonBuilder()
            .setCustomId('btn_mandado_aprovado')
            .setLabel(`Deferir mandado`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`1187577594472837171`);

            const btn_mandado_rejeitado = new ButtonBuilder()
            .setCustomId('btn_mandado_rejeitado')
            .setLabel(`Indeferir mandado`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1187577594472837171`);

            const botao = new ActionRowBuilder()
            .addComponents(btn_mandado_aprovado, btn_mandado_rejeitado);

            // < Busca o fórum de processos >
            const channel = client.channels.cache.get(forum_mandados);
            
            channel.threads.create(
            { 
                name: `Mandado Nº ${total_registros+1} | Por ${interaction.member.nickname}`, 
                message: { embeds: [embed], components: [botao] }, 
                type: ChannelType.PrivateThread 
            }) 
            .then(async thread => 
            {
                // < Cria os dados no banco de dados >
                pool.query(`INSERT INTO mandados (policial, nome, passaporte, rg, idade, data, delito, status, observacao) VALUES (${interaction.user.id}, "${nome}", ${passaporte}, "${rg}", ${idade}, NOW(), "${delitos}", "Aberto", "Nenhuma")`);
                
                await thread.members.add(interaction.user.id);
                await thread.send({ content: `## <:oab_aviso:1188557292073918555> Anexo\n${interaction.user}, envie abaixo o **arquivo PDF** do seu mandado.\n* Ao enviar, marque o cargo Juízes e aguarde o retorno.` });
                await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Solicitação de Mandado de Prisão\nSua solicitação de **Mandado de Prisão** (ID: ${total_registros+1}) foi aberto com sucesso! Acesse em: <#${thread.id}>.`, ephemeral: true });
            })
        })
    },
};