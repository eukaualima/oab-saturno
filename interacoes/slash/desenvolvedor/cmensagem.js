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

        mensagem = `# <:oab_balanca:1187577597173960754> Certidão de Nascimento
 1️⃣  Por se tratar de um documento, prestar bastante atenção na hora de preencher o formulário do Bot (a grafia de acordo com o que o cliente solicitou)! 
        
> ***Importante lembrar ao cliente que toda solicitação de documento ele tem um prazo de 24 a 48 horas para ser entregue e publicado no Cartório de Saturno!*** 
        
 2️⃣  Honorários: 
        
🔹 Total a ser cobrado ao cliente: **R$ 400mil (Quatrocentos mil)** onde,
🔸 **Juiz - R$ 200.000,00 (Duzentos mil)**
🔸 **Estagiário/Advogado/Promotor - R$ 200.000,00 (Duzentos mil)**
        
 3️⃣   Assim que abrir o ticket de solicitação,  buscar o ticket aberto e marcar a <@&1106408610000543834> <@241707361138376704>  (ID: 7) que irá confeccionar o documento, bem como postar o print da transferência bancária com valor do honorário e o nome da Juíza!`;

        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId('btn_certidao')
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
