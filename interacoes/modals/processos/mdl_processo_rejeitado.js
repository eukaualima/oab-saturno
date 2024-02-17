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
const { categoria_fechados, canal_vereditos, cargo_juiz, cargo_everyone, footer, cor_embed } = require('../../../config.json');
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
	id: "mdl_processo_rejeitado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta as informações passadas no modal >
        const motivo = interaction.fields.getTextInputValue('motivo_rejeicao')
        const codigo = interaction.fields.getTextInputValue('codigo_processo')
        let natureza = interaction.fields.getTextInputValue('natureza_processo')

        if (natureza == "certidaos")
        {
            natureza = "certidoes";
        }
        else if (natureza == "adocaos")
        {
            natureza = "adocoes";
        }
        
        // < Busca o processo marcado >
        pool.query(`SELECT * FROM ${natureza} WHERE codigo = ${codigo}`, async function (erro, processo)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${processo[0].advogado}`, async function (erro, advogado_tab)
            {
                pool.query(`SELECT * FROM servidores WHERE discord_id = ${processo[0].juiz}`, async function (erro, juiz)
                {
                    if (processo[0].juiz == "Ninguém")
                    {
                        return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Nenhum juiz(a) está responsável por este processo. Clique no botão para assumir o caso e tente novamente.`, ephemeral: true })
                    }
                    else if (processo[0].juiz != interaction.user.id)
                    {
                        return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não é o(a) responsável pelo processo.`, ephemeral: true })
                    }
                    else if (processo[0].status == "Fechado")
                    {
                        return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Este processo já foi resolvido.`, ephemeral: true })
                    }

                    // < Coleta o advogado e o juiz responsável do caso >
                    // const advogado = client.users.cache.get(processo[0].advogado);

                    // < Envia a mensagem ao advogado >
                    // advogado.send({ content: `## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${advogado.displayName}. Passando aqui para te informar que o seu processo foi **rejeitado** pelo(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)}.\n### <:oab_veredito:1187577594472837171> Motivo da rejeição\n${motivo}` })

                    await interaction.update({ components: [] });
                    
                    // < Atualiza o status do processo no banco de dados >
                    pool.query(`UPDATE ${natureza} SET status = "Indeferido" WHERE codigo = ${codigo}`);
                    pool.query(`UPDATE ${natureza} SET observacoes = "${motivo}" WHERE codigo = ${codigo}`);
                    pool.query(`UPDATE servidores SET processos = ${advogado_tab[0].processos + 1} WHERE discord_id = ${processo[0].advogado}`)
                    pool.query(`UPDATE servidores SET processos = ${juiz[0].processos + 1} WHERE discord_id = ${processo[0].juiz}`)

                    // < Fecha o canal e marca como fechado >
                    let cargo = await interaction.guild.roles.cache.get(cargo_juiz);
                    let everyone = await interaction.guild.roles.cache.get(cargo_everyone);
                    let vereditos = await interaction.guild.channels.cache.get(canal_vereditos);
                    let advogado_user = await interaction.guild.members.fetch(processo[0].advogado);

                    await interaction.channel.permissionOverwrites.edit(advogado_user, { ViewChannel: false });
                    await interaction.channel.setName(`fechado-${natureza}-${codigo}`);
                    await interaction.channel.setParent(categoria_fechados);
                    await interaction.channel.permissionOverwrites.edit(cargo, {
                        ViewChannel: true,
                    });
                    await interaction.channel.permissionOverwrites.edit(everyone, {
                        ViewChannel: false,
                    });

                   // < Sistema de "Vereditos" >
                    const veredito_embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`* **Identificação do processo:** ${natureza}#${codigo}\n* **Advogado(a):** Dr(a). ${advogado_user}\n* **Juiz(a):** Exmo(a). <@${juiz[0].discord_id}>`)
                    .setColor(cor_embed)
                    .addFields([
                        { name: `<:oab_veredito:1187577594472837171> | Veredito`, value: `Processo **INDEFERIDO**.` },
                        { name: `<:oab_escrita:1188542389179133992> | Motivo`, value: `${motivo ? motivo : "Não informado pelo(a) Juiz(a)."}` },
                        { name: `<:oab_data:1188268177063424050> | Data de fechamento`, value: `${moment().format('LLLL')}` },
                    ])
                    .setThumbnail(client.user.avatarURL({ size: 1024 }))
                    .setImage('https://i.imgur.com/qTzpZts.png')
                    .setFooter({ text: footer, iconURL: client.user.avatarURL() });
                    
                    // await vereditos.send({ content: `## <:oab_veredito:1187577594472837171> Veredito\nO(a) juiz(a) **${interaction.user}** acaba de **aprovar** o processo de <@${processo[0].advogado}>.\n### <:oab_juiz:1187577598776193136> Observações\n${motivo ? motivo : "Nenhuma."}\n\n* O identificador deste processo é *${natureza}#${codigo}*.` });
                    await vereditos.send({ content: `${advogado_user}`, embeds: [veredito_embed] });
                    await interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\nProcesso **fechado** e **arquivado**, só poderá ser visto por juízes.\n## <:oab_juiz:1187577598776193136> Juiz(a) responsável\n${client.users.cache.get(processo[0].juiz)}\n## <:oab_veredito:1187577594472837171> Veredito\n${motivo ? motivo : "Não informado pelo(a) juiz(a)."}\n### <:oab_anuncio:1202084582992924692> Veredito publicado\n<#${canal_vereditos}>`})
                })
            })
        })
    },
};