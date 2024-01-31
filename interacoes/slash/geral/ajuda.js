/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("ajuda")
        .setDescription("Veja todos os comandos do sistema da OAB."),

    // < Executa o comando >
	async execute(interaction) 
    {
        await interaction.editReply({ content: `## <:oab_logo:1202096934093852732> Comandos - Sistema OAB\nAbaixo segue a lista com todos os comandos existentes atualmente.\n### <:oab_maleta:1188250462739251220> Recursos Humanos (apenas Juiz(a))\n* </cmembro:1201717842618089573> Cria um novo membro no Corpo Jurídico. Este comando adiciona o cargo e registra o usuário no banco de dados do sistema.\n* </promover:1189423482480623730> Promove uma pessoa do corpo jurídico já registrada no banco de dados e que tenha pelo menos o cargo Estagiário(a).\n* </demitir:1189423482480623729> Faz a demissão e remoção de cargos de qualquer pessoa do corpo jurídico, desde o Estagiário(a) ao(à) Juiz(a).\n### <:oab_email:1187883019667779617> Processos\n* </gcertidao:1189423482480623727> Gera um documento oficial da Certidão de Nascimento com nome do nascido, data de nascimento e pais.\n* </casodp:1189423482480623726> Faz o registro de um caso atendido no Departamento de Polícia.\n### <:oab_aberto:1187577603515764857> Geral\n* </ping:1189423481985712202> Verifica o tempo de resposta atual do sistema da OAB.\n* </perfil:1201717842618089572> Verifique seus dados ou de outro usuário no sistema da OAB.\n* </anuncio:1202085535896846367> Envie seu anúncio personalizado no canal <#1108792694978904227>.`, ephemeral: true });
	},
};
