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
const { cargo_juiz, cargo_everyone, categoria_limpezas, footer } = require('../../../config.json');
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
        const { ViewChannel, SendMessages } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const reu_nome = interaction.fields.getTextInputValue('limpar_ficha_reu_nome')
        const reu_id = interaction.fields.getTextInputValue('limpar_ficha_reu_id')
        const meses = interaction.fields.getTextInputValue('limpar_ficha_meses')

        // < Calcula os honorários >
        const honorarios_totais = honorarios(meses);

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM limpezas`, async function (erro, limpezas)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
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
                        .setDescription(`Processo de Limpeza de Ficha Nº${total_registros+1} aberto com sucesso.\n* Dr(a). ${interaction.user.displayName} (Passaporte: ${servidores[0].passaporte})`)
                        .addFields([
                            { name: `<:oab_reu:1187577589448060989> | Réu`, value: `${reu_nome}`, inline: true },
                            { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `${reu_id}`, inline: true },
                            { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment().format('LLLL')}` },
                            { name: `<:oab_algemas:1188269430388559892> | Meses`, value: `${meses}`, inline: true },
                            { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ ${honorarios_totais.toLocaleString('pt-BR')},00`, inline: true },
                        ])
                        .setThumbnail(interaction.user.avatarURL())
                        .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                        canal.send({ embeds: [embed] })
                    })
                await interaction.reply({ content: `<:oab_check:1187428122988126348> **|** Processo de Limpeza de Ficha Nº${total_registros+1} aberto com sucesso.`, ephemeral: true });
            })
        })
    },
};