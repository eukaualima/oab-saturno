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
	id: "mdl_certidao",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const crianca = interaction.fields.getTextInputValue('certidao_crianca')
        const pai = interaction.fields.getTextInputValue('certidao_pai')
        const mae = interaction.fields.getTextInputValue('certidao_mae')
        const data = interaction.fields.getTextInputValue('certidao_data')

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `## <a:oab_carregando:1187884300264275968> Aguarde...\nEstou criando o **canal** do processo!`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM certidoes`, async function (erro, certidoes)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo certidoes >
                let total_registros = certidoes[0].total_registros;
                
                // < Cria um novo canal para o processo >
                interaction.guild.channels.create(
                    { 
                        name: `certidao-${total_registros+1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_certidao,
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
                        .setDescription(`Processo de Certidão de Nascimento Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                        .setColor(cor_embed)
                        .addFields([
                            { name: `<:oab_crianca:1188547935579938936> | Criança`, value: `${crianca}`, inline: true },
                            { name: `<:oab_cliente:1188541685572051054> | Mãe`, value: `${mae}`, inline: true },
                            { name: `<:oab_pai:1188548184780329051> | Pai`, value: `${pai}`, inline: true },
                            { name: `<:oab_data:1188268177063424050> | Data de nascimento`, value: `${data}` },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 400.000,00`, inline: true },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO certidoes (advogado, juiz, crianca, mae, pai, data_nascimento, data_abertura, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", "${crianca}", "${mae}", "${pai}", "${data}", NOW(), "Aberto", "Nenhuma")`);
                        
                        await interaction.editReply({ content: `## <:oab_check:1187428122988126348> Sucesso!\n${interaction.user}, seu processo de **Certidão de Nascimento** (ID: ${total_registros+1}) foi aberto com sucesso no canal <#${canal.id}>.`, ephemeral: true });
                        
                        // < Cria os botões >
                        const btn_processo_aprovado = new ButtonBuilder()
                        .setCustomId('btn_processo_aprovado')
                        .setLabel(`Aprovar processo`)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_rejeitado = new ButtonBuilder()
                        .setCustomId('btn_processo_rejeitado')
                        .setLabel(`Rejeitar processo`)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji(`1187577594472837171`);

                        const btn_processo_assumir = new ButtonBuilder()
                        .setCustomId('btn_processo_assumir')
                        .setLabel(`Assumir processo`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`1187577598776193136`);

                        const botao = new ActionRowBuilder()
                        .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);

                        await canal.send({ embeds: [embed], components: [botao] })
                        await canal.send({ content: `### <:oab_aviso:1188557292073918555> Anexo\n${interaction.user}, envie abaixo o **comprovante da transferência** feita ao(à) Juiz(a) responsável.\n* Ao enviar, marque o cargo Juiz(a) e aguarde o retorno.` });
                    })
            })
        })
    },
};