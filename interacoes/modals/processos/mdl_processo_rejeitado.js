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
        
        // < Busca o processo marcado >
        pool.query(`SELECT * FROM ${natureza} WHERE codigo = ${codigo}`, async function (erro, processo)
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
            const advogado = client.users.cache.get(processo[0].advogado);

            // < Envia a mensagem ao advogado >
            advogado.send({ content: `## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${advogado.displayName}. Passando aqui para te informar que o seu processo foi **rejeitado** pelo(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)}.\n### <:oab_veredito:1187577594472837171> Motivo da rejeição\n${motivo}` })

            // < Atualiza o status do processo no banco de dados >
            pool.query(`UPDATE ${natureza} SET status = "Fechado" WHERE codigo = ${codigo}`);
            pool.query(`UPDATE ${natureza} SET observacoes = "${motivo}" WHERE codigo = ${codigo}`);

            // < Fecha o canal e marca como fechado >
            interaction.channel.permissionOverwrites.edit(processo[0].advogado, { ViewChannel: false });
            interaction.channel.setName(`fechado-${natureza}-${codigo}`);
            interaction.update({ components: [] });
            interaction.channel.send({ content: `## <:oab_juiz:1187577598776193136> Processo rejeitado\nO(a) excelentíssimo(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)} rejeitou o presente processo.\n\n### <:oab_veredito:1187577594472837171> Motivo da Rejeição\n${motivo}`})
        })
    },
};