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
const { cargo_juiz, cargo_everyone, categoria_adocao, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_adocao",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const crianca = interaction.fields.getTextInputValue('adocao_nome')
        const mae = interaction.fields.getTextInputValue('adocao_mae')
        const pai = interaction.fields.getTextInputValue('adocao_pai')
        const data = interaction.fields.getTextInputValue('adocao_data')

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM adocoes`, async function (erro, adocoes)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo adocoes >
                let total_registros = adocoes[0].total_registros;
                
                // < Cria um novo canal para o processo >
                interaction.guild.channels.create(
                    { 
                        name: `adocao-${total_registros+1}`,
                        type: ChannelType.GuildText,
                        parent: categoria_adocao,
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
                        .setDescription(`Processo de Adoção Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user} (Passaporte: ${servidores[0].passaporte})`)
                        .setColor(cor_embed)
                        .addFields([
                            { name: `<:oab_crianca:1188547935579938936> | Criança/Adulto`, value: `${crianca}` },
                            { name: `<:oab_cliente:1188541685572051054> | Mãe`, value: `${mae}` },
                            { name: `<:oab_pai:1188548184780329051> | Pai`, value: `${pai}` },
                            { name: `<:oab_data:1188268177063424050> | Data da adoção`, value: `${data}` },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 900.000,00` },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO adocoes (advogado, juiz, crianca, adulto, adotado, mae, pai, data_adocao, data_abertura, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", 0, 0, "${crianca}", "${mae}", "${pai}", "${data}", NOW(), "Aberto", "Nenhuma")`);
                        
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
                        canal.send({ content: `<:oab_aviso:1188557292073918555> **|** ${interaction.user}, negocie com o(a) Juiz(a) que assumir o caso a melhor data para acontecer a audiência.` });
                        canal.send({ content: `<:oab_aviso:1188557292073918555> **|** ${interaction.user}, envie as prints da transferência bancária feita para o(a) Juiz(a).` });
                        canal.send({ content: `<:oab_aviso:1188557292073918555> **|** ${interaction.user}, informe se o adotado é criança ou adulto para que o(a) Juiz(a) saiba quantas audiências ocorrerão.` });
                        interaction.reply({ content: `<:oab_check:1187428122988126348> **|** Processo de Adoção Nº${total_registros+1} aberto com sucesso! Acesso-o no canal <#${canal.id}>.`, ephemeral: true });
                    })
            })
        })
    },
};