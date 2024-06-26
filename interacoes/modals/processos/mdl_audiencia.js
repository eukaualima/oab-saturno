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
const { cargo_juiz, cargo_everyone, forum_processos, categoria_audiencia, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_audiencia",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const assunto = interaction.fields.getTextInputValue('audiencia_assunto')
        const requerente = interaction.fields.getTextInputValue('audiencia_cliente')
        const testemunhas = interaction.fields.getTextInputValue('audiencia_testemunhas')
        const acusados = interaction.fields.getTextInputValue('audiencia_acusados')
        const provas = interaction.fields.getTextInputValue('audiencia_provas')

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\n<a:oab_carregando:1187884300264275968> Aguarde a criação do seu **processo**...`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM audiencias`, async function (erro, audiencias)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }

                // < Coleta o total de processos do tipo audiencias >
                let total_registros = audiencias[0].total_registros;
                
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`Processo de Audiência Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                .setColor(cor_embed)
                .addFields([
                    { name: `<:oab_escrita:1188542389179133992> | Assunto`, value: `${assunto}` },
                    { name: `<:oab_cliente:1188541685572051054> | Requerente`, value: `\`\`\`txt\n${requerente}\`\`\`` },
                    { name: `<:oab_partes:1188556237911109764> | Acusados`, value: `\`\`\`txt\n${acusados}\`\`\`` },
                    { name: `<:oab_testemunhas:1188556234551464026> | Testemunhas`, value: `\`\`\`txt\n${testemunhas}\`\`\`` },
                    { name: `<:oab_arquivo:1203930183199887410> | Existem provas?`, value: `${provas}` },
                    { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                    { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 500.000,00` },
                ])
                .setThumbnail(interaction.user.avatarURL())
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
                    name: `Audiência Nº ${total_registros+1} | Dr(a). ${(interaction.member.nickname).replace(/(\d+|\|)/g, "")}`, 
                    message: { embeds: [embed], components: [botao] }, 
                    type: ChannelType.PrivateThread 
                }) 
                .then(async thread => 
                {
                    // < Cria os dados no banco de dados >
                    pool.query(`INSERT INTO audiencias (advogado, juiz, assunto, partes, testemunhas, data, status, observacoes, canal) VALUES (${interaction.user.id}, "Ninguém", "${assunto}", "${requerente}, ${acusados}", "${testemunhas}", NOW(), "Aberto", "Nenhuma", ${thread.id})`);
                    
                    await thread.members.add(interaction.user.id);
                    await thread.send({ content: `## <:oab_aviso:1188557292073918555> Anexo\n${interaction.user}, envie abaixo o **comprovante da transferência** feita ao(à) Juiz(a) responsável.\n* Ao enviar, marque o cargo Juiz(a) e aguarde o retorno.` });
                    await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\nSeu processo de **Audiência** (ID: ${total_registros+1}) foi aberto com sucesso! Acesse em: <#${thread.id}>.`, ephemeral: true });
                })
            })
        })
    },
};