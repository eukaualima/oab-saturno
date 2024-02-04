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
const { cargo_juiz, cargo_everyone, categoria_trocas, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_mudar_nome",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const nome_antigo = interaction.fields.getTextInputValue('mudar_nome_antigo')
        const nome_novo = interaction.fields.getTextInputValue('mudar_nome_novo')
        const passaporte = interaction.fields.getTextInputValue('mudar_nome_passaporte')
        const motivo = interaction.fields.getTextInputValue('mudar_nome_motivo')

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM trocas`, async function (erro, trocas)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo trocas >
                let total_registros = trocas[0].total_registros;
                
                // < Cria um novo canal para o processo >
                interaction.guild.channels.create(
                    { 
                        name: `troca-${total_registros+1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_trocas,
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
                        .setDescription(`Processo de Troca de Nome Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                        .setColor(cor_embed)
                        .addFields([
                            { name: `<:oab_cliente:1188541685572051054> | Nome antigo`, value: `${nome_antigo}`, inline: true },
                            { name: `✨ | Novo nome`, value: `${nome_novo}`, inline: true },
                            { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `${passaporte}` },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_escrita:1188542389179133992> | Motivo`, value: `${motivo}`, inline: true },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 500.000,00`, inline: true },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO trocas (advogado, juiz, cliente_nome, cliente_id, novo_nome, motivo, data, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", "${nome_antigo}", ${passaporte}, "${nome_novo}", "${motivo}", NOW(), "Aberto", "Nenhuma")`);
                        
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

                        await canal.send({ embeds: [embed], components: [botao] });
                        await canal.send({ content: `### <:oab_aviso:1188557292073918555> Anexo\n${interaction.user}, envie abaixo o **comprovante da transferência** feita ao(à) Juiz(a) responsável.\n* Ao enviar, marque o cargo Juiz(a) e aguarde o retorno.` });
                        await interaction.reply({ content: `<:oab_check:1187428122988126348> **|** Processo de Troca de Nome Nº${total_registros+1} aberto com sucesso! Acesso-o no canal <#${canal.id}>.`, ephemeral: true });
                    })
            })
        })
    },
};