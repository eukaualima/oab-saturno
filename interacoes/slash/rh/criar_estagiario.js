/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { cargo_juiz, cargo_estagiario, cargo_advogado, cargo_promotor } = require('../../../config.json');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("cmembro")
        .setDescription("Cria um(a) novo(a) membro(a).")
        .addUserOption(option =>
            option
            .setName("usuario")
            .setDescription("Marque a pessoa que irá receber o cargo.")
            .setRequired(true))
        .addIntegerOption(option =>
            option
            .setName("passaporte")
            .setDescription("Informe o passaporte da pessoa que irá receber o cargo.")
            .setMinValue(0)
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName("cargo")
            .setDescription("Informe o cargo que a pessoa irá receber.")
            .addChoices( 
                    { name: "Juiz(a)", value: "juiz_cargo" }, 
                    { name: "Promotor(a)", value: "promotor_cargo" }, 
                    { name: "Advogado(a)", value: "advogado_cargo" }, 
                    { name: "Estagiário(a)", value: "estagiario_cargo" } 
                )
            .setRequired(true)
            ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let usuario, membro, passaporte, cargo, nome_salvar;

        // < Coleta as informações passadas no comando >
        usuario = interaction.options.getUser("usuario");
        passaporte = interaction.options.getInteger("passaporte");
        cargo = interaction.options.getString("cargo");

        // < Nome do cargo >
        if (cargo == "juiz_cargo") nome_salvar = "Juiz(a)";
        if (cargo == "promotor_cargo") nome_salvar = "Promotor(a)";
        if (cargo == "advogado_cargo") nome_salvar = "Advogado(a)";
        if (cargo == "estagiario_cargo") nome_salvar = "Estagiário(a)";

        // < Coleta o cargo do usuário >
        membro = interaction.guild.members.cache.get(`${usuario.id}`);

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Verifica o cargo do usuário >
        if (cargo == "estagiario_cargo" && membro.roles.cache.some(cargo => cargo.id == cargo_estagiario))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** ${usuario} já é um(a) Estagiário(a).` });
        }
        if (cargo == "advogado_cargo" && membro.roles.cache.some(cargo => cargo.id == cargo_advogado))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** ${usuario} já é um(a) Advogado(a).` });
        }
        if (cargo == "promotor_cargo" && membro.roles.cache.some(cargo => cargo.id == cargo_promotor))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** ${usuario} já é um(a) Promotor(a).` });
        }
        if (cargo == "juiz_cargo" && membro.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** ${usuario} já é um(a) Juiz(a).` });
        }

        // < Verifica se ele já possui dados no banco de dados >
        pool.query(`SELECT * FROM servidores WHERE discord_id = ${usuario.id}`, async function (erro, servidores)
        {
            if (servidores.length == 0)
            {
                interaction.editReply({ content: `<a:oab_update:1187885557766946946> **|** Criando os dados de **${usuario}**. Aguarde a finalização, **não** faça mais nenhuma ação.` }).then(() =>
                {
                    // < Insere o usuário no banco de dados >
                    pool.query(`INSERT INTO advertencias (motivo, duracao, responsavel, data, advogado) VALUES ("Não há advertências", 0, "Ninguém", 0, ${usuario.id})`);
                    pool.query(`INSERT INTO servidores (discord_id, passaporte, cargo, registro, ferias, ferias_retorno, processos, casos) VALUES (${usuario.id}, ${passaporte}, "${nome_salvar}", NOW(), 0, 0, 0, 0)`);
                    
                    // < Adiciona o cargo ao usuário >
                    if (cargo == "juiz_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_juiz);
                    if (cargo == "promotor_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_promotor);
                    if (cargo == "advogado_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_advogado);
                    if (cargo == "estagiario_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_estagiario);
                    
                    // < Informa a atualização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** foi registrado(a) e já possui o cargo de ${nome_salvar}.` });
                        usuario.send(`## <:oab_logo:1202096934093852732> OAB - Saturno RP\nSeja muito bem-vindo(a) ao nosso corpo jurídico, ${usuario.displayName}! Fico feliz em informar que agora você é um(a) **${nome_salvar}**.`);
                    }, 5000);
                });

            }
            else
            {
                interaction.editReply({ content: `<a:oab_update:1187885557766946946> **|** ${usuario} já possui cadastro. Aguarde enquanto é finalizada a atualização do cargo.` }).then(() =>
                {
                    // < Atualiza o cargo do Estagiário >
                    pool.query(`UPDATE servidores SET cargo = "${nome_salvar}" WHERE discord_id = ${usuario.id}`);

                    // < Adiciona o cargo ao usuário >
                    if (cargo == "juiz_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_juiz);
                    if (cargo == "promotor_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_promotor);
                    if (cargo == "advogado_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_advogado);
                    if (cargo == "estagiario_cargo") interaction.guild.members.cache.get(`${usuario.id}`).roles.add(cargo_estagiario);

                    // < Informa a finalização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** agora possui o cargo de ${nome_salvar}.` });
                        usuario.send(`## <:oab_logo:1202096934093852732> OAB - Saturno RP\nSeja muito bem-vindo(a) ao nosso corpo jurídico, ${usuario.displayName}! Fico feliz em informar que agora você é um(a) **${nome_salvar}**.`);
                    }, 5000);
                });
            }
        })
	},
};
