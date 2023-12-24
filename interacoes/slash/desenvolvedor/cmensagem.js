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

        mensagem = `# <:oab_balanca:1187577597173960754> Limpezas de Ficha\n## 1️⃣ Preste atenção!\nA limpeza de ficha é muito importante, pois ela é quem permite o cidadão tenha acesso a troca de nome (entre outros direitos...) e também ter novamente o seu réu primário garantido por Lei! (sempre bom falar ao cliente da importância da ficha limpa)!\n## 2️⃣  Honorários\n<:oab_email:1187883019667779617>Simulação: Allex Inputlag (ID 977)  Solicita a limpeza de ficha.\n\n📑 Passo 1 - Abrir o painel (/mdt) e verificar pelo seu ID quantos meses de prisão o Cliente foi condenado - (Na simulação, Allex pegou 120 meses de prisão);\n📑Passo 2 - Fazer o cálculom multiplicando a pena total com o coeficiente de boa conduta (Coeficiente de Boa conduta: R$ 4.000)\n📑Total da Pena: 120 meses x R$ 4.000 = R$ 480.000,00 - Quatrocentos e oitenta mil (valor total a ser cobrado ao cliente) onde, \n🔸 **Juiz -** R$ 240.000,00 (Duzentos e quarenta mil) \n🔸 **Estagiário/Advogado/Promotor -** R$ 240.000,00 (Duzentos e quarenta mil) \n\nSempre o valor será 50% do Juiz e 50% do Estagiário/Advogado/Promotor \n## 3️⃣ Abertura do processo\nAssim que abrir o ticket de solicitação, buscar o ticket aberto e marcar a @Juíz(a) que irá atender o caso, bem como postar os prints da transferência bancária com valor do honorário e o nome da Juíza, e também as imagens da pesquisa do painel MDT onde consta o nome do cliente com o ID e o total de prisões (ver modelo)!`;

        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId('btn_limpar_ficha')
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
