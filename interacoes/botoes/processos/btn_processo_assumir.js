/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, Collection, PermissionsBitField, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const pool = require('../../../conexao/mysql');
const { cargo_juiz } = require('../../../config.json');

// < Inicia o botão >
module.exports = 
{
	id: "btn_processo_assumir",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta os dados do processo >
        const natureza = interaction.channel.name.replace(/[^a-zA-Z]/g,'') + 's';
        const codigo = interaction.channel.name.replace(/[^0-9]/g,'');

        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem avaliar e dar o veredito sobre o caso.`, ephemeral: true })
        }

        pool.query(`SELECT * FROM ${natureza} WHERE codigo = ${codigo}`, async function (erro, processo)
        {
            if (processo[0].juiz == "Ninguém")
            {
                pool.query(`UPDATE ${natureza} SET juiz = ${interaction.user.id} WHERE codigo = ${codigo}`);

                client.users.cache.get(processo[0].advogado).send({ content: `## <:oab_juiz:1187577598776193136> Status do processo\nO(a) excelentíssimo(a) Juiz(a) ${interaction.user} acabou de assumir seu processo.` })

                return interaction.reply({ content: `<:oab_juiz:1187577598776193136> **|** O(a) Juiz(a) ${interaction.user} acabou de assumir o processo.` });
            }
            else
            {
                return interaction.reply({ content: `<:oab_juiz:1187577598776193136> **|** O(a) Juiz(a) ${client.users.cache.get(processo[0].juiz)} já está como responsável deste processo.`, ephemeral: true });
            }
        })
    },
};