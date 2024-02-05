/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { cargo_juiz, canal_dm } = require('../../../config.json');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("notificar")
        .setDescription("Cria um(a) novo(a) membro(a).")
        .addUserOption(option =>
            option
            .setName("usuario")
            .setDescription("Marque a pessoa que irá receber a notificação em Mensagem Direta.")
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName("questionamento")
            .setDescription("Qual tipo de notificação será enviada?")
            .addChoices(
                { name: `⚠️ Pretende continuar no jurídico?`, value: `continuar`}
            )
            .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let usuario, membro, mensagem;

        // < Coleta as informações passadas no comando >
        usuario = interaction.options.getUser("usuario");
        membro = interaction.guild.members.cache.get(`${usuario.id}`);

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        mensagem = `## <:oab_logo:1202096934093852732> Sistema OAB\nPrezado(a) Advogado(a),\nEm nome da Excelentíssima **Juíza Marina M. Ricci**, solicito que responda ao questionamento abaixo:\n* **O(a) Dr(a). ainda pretende continuar como advogado(a) no Jurídico da Saturno?**\n*É importante a sua resposta! Não deixe de responder. Digite a sua resposta aqui mesmo.*`;
        await membro.send({ content: mensagem });

        await interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** ${membro} foi notificado(a) com sucesso e a resposta dele(a) será enviada em <#${canal_dm}>` });
    },
};
