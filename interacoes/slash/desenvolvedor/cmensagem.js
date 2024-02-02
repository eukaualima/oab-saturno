/**
 * @file Comando para criar mensagens em um canal específico.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { footer } = require('../../../config.json');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("cmensagem")
    .setDescription("Faz o sistema OAB enviar uma mensagem em um canal.")
    .addStringOption(option =>
        option
        .setName("id")
        .setDescription("Informe o id do processo.")
        .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let desenvolvedor, mensagem, id;

        id = interaction.options.getString("id");

        desenvolvedor = "513880665754828800";

        if (interaction.user.id != desenvolvedor)
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas o **desenvolvedor** do sistema tem acesso a este comando.` })
        }

        mensagem = `# <:oab_balanca:1187577597173960754> Abertura de Processo\nPara abrir o processo, clique no botão abaixo e responda corretamente o formulário.`;

        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId(`btn_${id}`)
        .setLabel(`Abrir processo`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`1187883019667779617`);

        const botao = new ActionRowBuilder()
        .addComponents(btn_processo);

        // < Envia a mensagem no canal >
        // interaction.editReply({ content: `Mensagem enviada com sucesso.`, ephemeral: true })
        await interaction.editReply({ content: `Mensagem criada!` }).then(msg => msg.delete());
        await interaction.channel.send({ content: `${mensagem}`, components: [botao] });
	},
};
