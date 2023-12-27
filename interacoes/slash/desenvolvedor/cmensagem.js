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
    .setDescription("Faz o sistema OAB enviar uma mensagem em um canal."),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let desenvolvedor, mensagem;

        desenvolvedor = "513880665754828800";

        if (interaction.user.id != desenvolvedor)
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas o **desenvolvedor** do sistema tem acesso a este comando.` })
        }

        mensagem = `# <:oab_balanca:1187577597173960754> Audiência de Conciliação  

1️⃣  Quando solicitar a audiência, após o ticket aberto, marcar a TAG <@&1106408610000543834> para saber  da disponibilidade das juízas para o caso! 
        
> ***Importante lembrar ao cliente que toda solicitação de documento ele tem um prazo de 24 a 48 horas para ser entregue e publicado no Cartório de Saturno!*** 
        
2️⃣  Honorários (cobrar no fim da audiência): 
        
🔹 Total a ser cobrado ao cliente: **R$ 1.500.000,00** (Um milhão e quinhentos mil) - Valor está incluso ***a certidão de separação e as trocas de nomes do casal separado***onde,
🔸 **Juiz - R$ 1.000.000,00 (Um milhão)**
🔸 **Advogado/Promotor - R$ 500mil (Quinhentos mil)**
        
3️⃣   Assim que abrir o ticket de solicitação postar a certidão de casamento e também o print da transferência bancária com valor do honorário e o nome da Juíza do caso!`;

        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId('btn_divorcio')
        .setLabel(`Abrir processo`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`1187883019667779617`);

        const botao = new ActionRowBuilder()
        .addComponents(btn_processo);

        // < Envia a mensagem no canal >
        interaction.reply({ content: `Mensagem enviada com sucesso.`, ephemeral: true })
        interaction.channel.send({ content: `${mensagem}`, components: [botao] });
	},
};
