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
        await interaction.reply({ content: `# <:oab_balanca:1187577597173960754>  Comandos atuais\nAbaixo segue a lista com todos os comandos existentes atualmente.\n## <:oab_maleta:1188250462739251220> Recursos Humanos\n* \`/cestagiario\` Cria um novo estagiário. Este comando adiciona o cargo "Estagiário(a)" e registra o usuário no banco de dados do bot.\n* \`/promover\` Promove uma pessoa do corpo jurídico já registrada no banco de dados e que tenha pelo menos o cargo Estagiário(a).\n* \`/demitir\` Faz a demissão e remoção de cargos de qualquer pessoa do corpo jurídico, desde o Estagiário(a) a Juiz(a).\n## <:oab_email:1187883019667779617> Processos\n* \`/gcertidao\` Gera um documento oficial da Certidão de Nascimento com nome do nascido, data de nascimento e pais.\n* \`/casodp\` Faz o registro de um caso atendido no Departamento de Polícia.\n## <:oab_aberto:1187577603515764857> Geral\n* \`/ping\` Verifica o tempo de resposta atual do sistema da OAB.\n* \`/ping\` Verifica todos os comandos do sistema da OAB.`, ephemeral: true });
	},
};
