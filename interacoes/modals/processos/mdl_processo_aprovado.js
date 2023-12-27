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
	id: "mdl_processo_aprovado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta as informações passadas no modal >
        const motivo = interaction.fields.getTextInputValue('motivo_aprovacao')
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
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${processo[0].advogado}`, async function (erro, advogado_tab){
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
                    const advogado = client.users.cache.get(processo[0].advogado);
        
                    // < Envia a mensagem ao advogado >
                    advogado.send({ content: `## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${advogado.displayName}. Passando aqui para te informar que o seu processo foi **aprovado** pelo(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)}.\n### <:oab_veredito:1187577594472837171> Motivo da aprovação\n${motivo ? motivo : "Não informado pelo(a) juiz(a)."}` })
        
                    // < Atualiza o status do processo no banco de dados >
                    pool.query(`UPDATE ${natureza} SET status = "Fechado" WHERE codigo = ${codigo}`);
                    pool.query(`UPDATE ${natureza} SET observacoes = "${motivo ? motivo : "Não informado pelo juiz(a)."}" WHERE codigo = ${codigo}`);
                    pool.query(`UPDATE servidores SET processos = ${advogado_tab[0].processos + 1} WHERE discord_id = ${processo[0].advogado}`)
                    pool.query(`UPDATE servidores SET processos = ${juiz[0].processos + 1} WHERE discord_id = ${processo[0].juiz}`)
        
                    // < Fecha o canal e marca como fechado >
                    interaction.channel.permissionOverwrites.edit(processo[0].advogado, { ViewChannel: false });
                    interaction.channel.setName(`fechado-${natureza}-${codigo}`);
                    interaction.update({ components: [] });
                    interaction.channel.send({ content: `## <:oab_juiz:1187577598776193136> Processo aprovado\nO(a) excelentíssimo(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)} aprovou o presente processo.\n\n### <:oab_veredito:1187577594472837171> Motivo da aprovação\n${motivo ? motivo : "Não informado pelo(a) juiz(a)."}`})
                })
            })
        })
    },
};