/**
 * @file Comando para criar mensagens em um canal específico.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { canal_resultados, canal_ajuda } = require('../../../config.json');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("cpost")
    .setDescription("Faz o sistema OAB enviar um post no canal de fórum.")
    .addStringOption(option =>
        option
        .setName("mensagem")
        .setDescription("Informe a mensagem do post.")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("titulo")
        .setDescription("Informe o título do post.")
        .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const mensagem = interaction.options.getString("mensagem").replace(/\\n/g, '\n');; 
        const titulo = interaction.options.getString("titulo"); 

        await interaction.editReply({ content: `Post criado!` }).then(msg => msg.delete());

        const channel = await client.channels.cache.get(canal_ajuda);
        await channel.threads.create({ name: `${titulo}`, message: { content: `${mensagem}` }, appliedTags: [] });
	},
};
