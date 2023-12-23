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
        .setName("cadv")
        .setDescription("Cria um(a) novo(a) advogado(a).")
        .addUserOption(option =>
            option
            .setName("usuario")
            .setDescription("Marque a pessoa que irá receber o cargo de advogado(a).")
            .setRequired(true))
        .addIntegerOption(option =>
            option
            .setName("passaporte")
            .setDescription("Informe o passaporte da pessoa que irá receber o cargo de advogado(a).")
            .setMinValue(0)
            .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let usuario, membro, passaporte;

        // < Coleta as informações passadas no comando >
        usuario = interaction.options.getUser("usuario");
        passaporte = interaction.options.getInteger("passaporte");

        // < Coleta o cargo do usuário >
        membro = interaction.guild.members.cache.get(`${usuario.id}`);

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == "1187867084689002576"))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Verifica se o usuário já é um advogado >
        if (membro.roles.cache.some(cargo => cargo.id == "1187866961770709165"))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** ${usuario} já é um(a) Advogado(a).`, ephemeral: true });
        }

        // < Verifica se ele já possui dados no banco de dados >
        pool.query(`SELECT * FROM servidores WHERE discord_id = ${usuario.id}`, async function (erro, servidores)
        {
            if (servidores.length == 0)
            {
                interaction.reply({ content: `<a:oab_update:1187885557766946946> **|** Criando os dados de **${usuario}**. Aguarde a finalização, **não** faça mais nenhuma ação.`, ephemeral: true }).then(() =>
                {
                    // < Insere o usuário no banco de dados >
                    pool.query(`INSERT INTO advertencias (motivo, duracao, responsavel, data) VALUES ("Não há advertências", 0, "Ninguém", 0)`);
                    pool.query(`INSERT INTO servidores (discord_id, passaporte, cargo, registro, ferias, ferias_retorno) VALUES (${usuario.id}, ${passaporte}, "Advogado(a)", NOW(), 0, 0)`);
                    
                    // < Adiciona o cargo ao usuário >
                    interaction.guild.members.cache.get(`${usuario.id}`).roles.add('1187866961770709165');
                    
                    // < Informa a atualização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** foi registrado(a) e já possui o cargo de Advogado(a).` });
                    }, 5000);
                });

            }
            else
            {
                interaction.reply({ content: `<a:oab_update:1187885557766946946> **|** ${usuario} já possui cadastro. Aguarde enquanto é finalizada a atualização do cargo.` }).then(() =>
                {
                    // < Atualiza o cargo do advogado >
                    pool.query(`UPDATE servidores SET cargo = "Advogado(a)" WHERE discord_id = ${usuario.id}`);

                    // < Adiciona o cargo >
                    interaction.guild.members.cache.get(`${usuario.id}`).roles.add('1187866961770709165');

                    // < Informa a finalização depois de 5s >
                    setTimeout(() => {
                        interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Finalizado! **${usuario}** agora possui o cargo de Advogado(a).` });
                    }, 5000);
                });
            }
        })
	},
};
