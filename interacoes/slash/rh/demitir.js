/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { SlashCommandBuilder } = require("discord.js");
const pool = require("../../../conexao/mysql");

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("demitir")
        .setDescription("Demite um(a) integrante do corpo jurídico.")
        .addUserOption(option =>
            option
            .setName("usuario")
            .setDescription("Marque a pessoa que irá receber a demissão.")
            .setRequired(true))
        .addStringOption(option =>
                option
                .setName("motivo")
                .setDescription("Por que está demitindo esta pessoa?")
                .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let usuario, membro, motivo;

        // < Coleta as informações passadas no comando >
        usuario = interaction.options.getUser("usuario");
        motivo = interaction.options.getString("motivo");

        // < Coleta o cargo do usuário >
        membro = interaction.guild.members.cache.get(`${usuario.id}`);

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == "1187867084689002576"))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }
        
        // < Verifica o cargo >
        if (membro.roles.cache.some(cargo => cargo.id == "1188223032217575454"))
        {
            // < Remove o cargo >
            membro.roles.remove('1188223032217575454');

            // < Remove o cargo do banco de dados >
            pool.query(`UPDATE servidores SET cargo = "Nenhum" WHERE discord_id = ${usuario.id}`);

            // < Informa a pessoa demitida a demissão >
            usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}. Sinto em informar que você acaba de ser **desligado(a)** do cargo de **Estagiário(a)** do corpo jurídico da cidade. A decisão foi homologada pelo(a) Juiz(a) ${interaction.user.displayName}.\n### <:oab_veredito:1187577594472837171> Motivo da demissão\n${motivo}`);

            // < Retorna a mensagem ao usuário >
            return interaction.reply({ content: `<:oab_check:1187428122988126348> **|** ${usuario} foi demitido e teve seus cargos removidos.` });
        }
        else if (membro.roles.cache.some(cargo => cargo.id == "1187866961770709165"))
        {
            // < Remove o cargo >
            membro.roles.remove('1187866961770709165');

            // < Informa a pessoa demitida a demissão >
            usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}. Sinto em informar que você acaba de ser **desligado(a)** do cargo de **Advogado(a)** do corpo jurídico da cidade. A decisão foi homologada pelo(a) Juiz(a) ${interaction.user.displayName}.\n### <:oab_veredito:1187577594472837171> Motivo da demissão\n${motivo}`)

            // < Remove o cargo do banco de dados >
            pool.query(`UPDATE servidores SET cargo = "Nenhum" WHERE discord_id = ${usuario.id}`);

            // < Retorna a mensagem ao usuário >
            return interaction.reply({ content: `<:oab_check:1187428122988126348> **|** ${usuario} foi demitido e teve seus cargos removidos.` });
        }
        else if (membro.roles.cache.some(cargo => cargo.id == "1187867220815122472"))
        {
            // < Remove o cargo >
            membro.roles.remove('1187867220815122472');

            // < Remove o cargo do banco de dados >
            pool.query(`UPDATE servidores SET cargo = "Nenhum" WHERE discord_id = ${usuario.id}`);

            // < Informa a pessoa demitida a demissão >
            usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}. Sinto em informar que você acaba de ser **desligado(a)** do cargo de **Promotor(a)** do corpo jurídico da cidade. A decisão foi homologada pelo(a) Juiz(a) ${interaction.user.displayName}.\n### <:oab_veredito:1187577594472837171> Motivo da demissão\n${motivo}`)

            // < Retorna a mensagem ao usuário >
            return interaction.reply({ content: `<:oab_check:1187428122988126348> **|** ${usuario} foi demitido e teve seus cargos removidos.` });
        }
        else
        {
            // < Remove o cargo >
            membro.roles.remove('1187867084689002576');

            // < Remove o cargo do banco de dados >
            pool.query(`UPDATE servidores SET cargo = "Nenhum" WHERE discord_id = ${usuario.id}`);

            // < Informa a pessoa demitida a demissão >
            usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}. Sinto em informar que você acaba de ser **desligado(a)** do cargo de **Juiz(a)** do corpo jurídico da cidade. A decisão foi homologada pelo(a) Juiz(a) ${interaction.user.displayName}.\n### <:oab_veredito:1187577594472837171> Motivo da demissão\n${motivo}`)

            // < Retorna a mensagem ao usuário >
            return interaction.reply({ content: `<:oab_check:1187428122988126348> **|** ${usuario} foi demitido e teve seus cargos removidos.` });
        }
	},
};
