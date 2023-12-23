/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("promover")
        .setDescription("Promove um(a) membro(a) para Advogado(a), Promotor(a) ou Juiz(a).")
        .addUserOption(option =>
            option
            .setName("usuario")
            .setDescription("Marque a pessoa que irá receber a promoção.")
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName("cargo")
            .setDescription("Escolha o cargo que a pessoa promovida irá receber.")
            .setRequired(true)
            .addChoices(
                { name: "Advogado(a)", value: 'advogado_promocao' },
                { name: "Promotor(a)", value: 'promotor_promocao' },
                { name: "Juiz(a)", value: 'juiz_promocao' },
            )),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let usuario, membro, cargo;

        // < Coleta as informações passadas no comando >
        usuario = interaction.options.getUser("usuario");
        cargo = interaction.options.getString("cargo");

        // < Coleta o cargo do usuário >
        membro = interaction.guild.members.cache.get(`${usuario.id}`);

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == "1187867084689002576"))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Verifica se ele já possui dados no banco de dados >
        pool.query(`SELECT * FROM servidores WHERE discord_id = ${usuario.id}`, async function (erro, servidores)
        {
            interaction.reply({ content: `<a:oab_update:1187885557766946946> **|** Atualizando os dados de ${usuario}. Aguarde!` }).then(() =>
            {
                // < Verifica a opção que o usuário selecionou >
                if (cargo == "advogado_promocao")
                {
                    if (membro.roles.cache.some(cargo => cargo.id == "1187866961770709165"))
                    {
                        return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** **${usuario}** já é um(a) Advogado(a).` });
                    }
                    // < Atualiza o cargo do advogado >
                    pool.query(`UPDATE servidores SET cargo = "Advogado(a)" WHERE discord_id = ${usuario.id}`);
    
                    // < Adiciona o cargo >
                    interaction.guild.members.cache.get(`${usuario.id}`).roles.add('1187866961770709165');
    
                    // < Informa a finalização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** agora possui o cargo de Advogado(a).` });
                        usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}! Fico feliz em informar que você promovido(a) ao cargo de **Advogado(a)** pelo(a) Juiz(a) ${interaction.user.displayName}.`);
                    }, 5000);
                }
                else if (cargo == "promotor_promocao")
                {
                    if (membro.roles.cache.some(cargo => cargo.id == "1187867220815122472"))
                    {
                        return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** **${usuario}** já é um(a) Promotor(a).` });
                    }
                    // < Atualiza o cargo do advogado >
                    pool.query(`UPDATE servidores SET cargo = "Promotor(a)" WHERE discord_id = ${usuario.id}`);
    
                    // < Adiciona o cargo >
                    interaction.guild.members.cache.get(`${usuario.id}`).roles.add('1187867220815122472');
    
                    // < Informa a finalização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** agora possui o cargo de Promotor(a).` });
                        usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}! Fico feliz em informar que você promovido(a) ao cargo de **Promotor(a)** pelo(a) Juiz(a) ${interaction.user.displayName}.`);
                    }, 5000);
                }
                else
                {
                    if (membro.roles.cache.some(cargo => cargo.id == "1187867084689002576"))
                    {
                        return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** **${usuario}** já é um(a) Juiz(a).` });
                    }

                    // < Atualiza o cargo do advogado >
                    pool.query(`UPDATE servidores SET cargo = "Juiz(a)" WHERE discord_id = ${usuario.id}`);
    
                    // < Adiciona o cargo >
                    interaction.guild.members.cache.get(`${usuario.id}`).roles.add('1187867084689002576');
    
                    // < Informa a finalização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** agora possui o cargo de Juiz(a).` });
                        usuario.send(`## <:oab_balanca:1187577597173960754> OAB - Saturno RP\nOlá, ${usuario.displayName}! Fico feliz em informar que você promovido(a) ao cargo de **Juiz(a)** pelo(a) Juiz(a) ${interaction.user.displayName}.`);
                    }, 5000);
                }
            });
        })
	},
};
