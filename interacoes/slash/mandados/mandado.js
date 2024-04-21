/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment-timezone');
const { footer, casos_dp, cor_embed, cargo_advogado, cargo_estagiario, cargo_juiz, cargo_adm } = require("../../../config.json");

moment.tz('America/Sao_Paulo')

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("mandado")
    .setDescription("Pesquise o status de um mandado qualquer.")
    .addIntegerOption(option =>
        option
        .setName("id")
        .setDescription("Qual o ID do mandado?")
        .setMinValue(1)
        .setRequired(true)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const id = interaction.options.getInteger("id");

        pool.query(`SELECT * FROM mandados WHERE codigo = ${id}`, async function (erro, mandado)
        {
            if (erro)
            {
                return interaction.editReply({ content: `<:oab_error:1187428311014576208> | Não há um mandado com este ID.` })
            }

            let policial = mandado[0].policial;
            let nome = mandado[0].nome;
            let passaporte = mandado[0].passaporte;
            let rg = mandado[0].rg;
            let idade = mandado[0].idade;
            let data = mandado[0].data;
            let delitos = mandado[0].delito;
            let status = mandado[0].status;
            let observacao = mandado[0].observacao;
            let prisao = mandado[0].prisao;

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`Mandado de Prisão Nº${id}\n* Elaborado por ${client.users.cache.get(policial)}`)
            .setColor(cor_embed)
            .addFields([
                { name: `<:oab_reu:1187577589448060989> | Dados do Mandado`, value: `\`\`\`txt\nNOME: ${nome}\nPASSAPORTE: ${passaporte}\nRG: ${rg}\nIDADE: ${idade}\nDELITOS: ${delitos}\`\`\`` },
                { name: `<:oab_algemas:1188269430388559892> | Prisão`, value: `\`\`\`txt\n${prisao}\`\`\``, inline: true },
                { name: `<:oab_veredito:1187577594472837171> | Status`, value: `\`\`\`txt\n${status}\`\`\``, inline: true },
                { name: `<:oab_email:1187883019667779617> | Observações do(a) Juiz(a)`, value: `\`\`\`txt\n${observacao}\`\`\`` },
                { name: `<:oab_data:1188268177063424050> | Data de abertura`, value: `${moment(data).format('LLLL')}` },
            ])
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: footer, iconURL: client.user.avatarURL() });

            await interaction.editReply({ embeds: [embed] });
        })
	},
};
