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

        mensagem = `# <:oab_balanca:1187577597173960754> Adoção
1️⃣  Criança:
        
🔅 Está sempre atento na hora de solicitar a todos os dados pessoais da criança e dos pais adotivos (pedir print do F11 dos envolvidos e anexar ao ticket aberto da solicitação de adoção)
🔅 Para adoção de criança serão feitas 2 audiências, mas será cobrada os honorários apenas de 1.
        
2️⃣  Adulto:
        
🔅 Igual como o da criança, mas terá apenas uma única audiência.
        
3️⃣  Honorários (criança e adulto): 
        
🔹 Total a ser cobrado ao cliente:** R$ 500mil** (Quinhentos mil) da audiência + R$ **400 mil **(Quatrocentos mil) da certidão = **R$ 900mil (Novecentos mil) **onde,
🔸 **Juiz - R$ 450.000,00 (Quatrocentos e cinquenta mil)**
🔸 **Advogado/Promotor - R$ 450.000,00 (Quatrocentos e cinquenta mil)**
        
> ***Importante lembrar ao cliente que toda solicitação de documento ele tem um prazo de 24 a 48 horas para ser entregue e publicado no Cartório de Saturno!*** 
        
🧑‍⚖️ ***Caso tenha troca de nome, fazer a solicitação a parte em*** <#1111399577178882138>
        
3️⃣   Assim que abrir o ticket de solicitação,  buscar o ticket aberto e marcar a <@&1106408610000543834> que irá atender o caso, bem como postar o print da transferência bancária com valor do honorário e o nome da Juíza!`;

        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId('btn_adocoes')
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
