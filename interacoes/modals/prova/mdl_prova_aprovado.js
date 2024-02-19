
/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { Permissions, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_resultados, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_prova_aprovado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta as informações passadas no modal >
        const passaporte = interaction.fields.getTextInputValue('prova_passaporte');
        const local = interaction.fields.getTextInputValue('prova_nome');

        // < Verifica se ele tem alguma prova em análise >
        pool.query(`SELECT * FROM provas WHERE passaporte = '${passaporte}'`, async function (erro, provas)
        {
            await pool.query(`UPDATE provas SET resultado = "Aprovado(a)" WHERE passaporte = ${passaporte}`);
            await pool.query(`UPDATE provas SET juiz = "${interaction.user.id}" WHERE passaporte = ${passaporte}`);

            const canal = await client.channels.cache.get(canal_resultados);
            canal.send({ content: `# <:oab_logo:1202096934093852732> Resultado: Prova OAB\n<@${provas[0].discord_id}> acaba de ser **aprovado(a)**, com um total de **${provas[0].pontos}** acertos.\n* Por gentileza, candidato(a), procure o(a) Excelentíssimo(a) Juiz(a) ${interaction.user} na(o) **${local}**.` });
            
            await client.channels.cache.get(`${provas[0].canal}`).delete();

            // < Cria o botãos >
            const btn_processo_excluir = new ButtonBuilder()
            .setCustomId('btn_processo_excluir')
            .setLabel(`Excluir`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1208285382634897491`);

            const botao = new ActionRowBuilder()
            .addComponents(btn_processo_excluir);

            await interaction.reply({ content: `Resultado postado no canal <#${canal_resultados}>!`, components: [botao] })
        });
    },
};