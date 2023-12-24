/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment');
const { footer, casos_dp, cor_embed } = require("../../../config.json");

moment.locale('pt-BR');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("casodp")
    .setDescription("Registrar a defensoria de um cliente no Departamento de Polícia.")
    .addStringOption(option =>
        option
        .setName("policial")
        .setDescription("Informe o nome do policial que fez a prisão.")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("nome")
        .setDescription("Informe o nome do(a) réu.")
        .setRequired(true))
    .addIntegerOption(option =>
        option
        .setName("passaporte")
        .setDescription("Informe o passaporte do(a) réu.")
        .setMinValue(1)
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("prisão")
        .setDescription("Informe o motivo da prisão.")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("veredito")
        .setDescription("Escreva um pouco sobre a decisão final da sentença.")
        .setRequired(true)),
    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let policial, reu_nome, reu_passaporte, prisao, veredito, estagiario, advogado, promotor, juiz;

        // < Coleta os dados passados no comando >
        policial = interaction.options.getString("policial");
        reu_nome = interaction.options.getString("nome");
        reu_passaporte = interaction.options.getInteger("passaporte");
        prisao = interaction.options.getString("prisão");
        veredito = interaction.options.getString("veredito");

        // < Atribuição dos cargos >
        estagiario = interaction.member.roles.cache.some(cargo => cargo.id == '1188223032217575454');
        advogado = interaction.member.roles.cache.some(cargo => cargo.id == '1187866961770709165');
        promotor = interaction.member.roles.cache.some(cargo => cargo.id == '1187867220815122472');
        juiz = interaction.member.roles.cache.some(cargo => cargo.id == '1187867084689002576');

        // < Verifica se o usuário é um Estagiário, Advogado, Promotor ou Juiz >
        if (estagiario || advogado || promotor || juiz)
        {
            // < Insere os dados no banco de dados >
            pool.query(`INSERT INTO casos (advogado, policial, reu_id, reu, prisao, veredito) VALUES ('${interaction.user.id}', '${policial}', ${reu_passaporte}, '${reu_nome}', '${prisao}', '${veredito}')`);
            
            // < Informa que foi registrado >
            interaction.reply({ content: `<:oab_check:1187428122988126348> **|** Seu **caso** foi registrado com sucesso. Verifique-o no canal <#${casos_dp}>.` });

            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                // < Embed para casos-dp >
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true })})
                .setTitle(`<:oab_policia:1188266116770975744> Registro de caso no Departamento de Polícia`)
                .setDescription(`Um novo caso no Departamento de Polícia acabou de ser registrado. Detalhes abaixo.`)
                .addFields([
                    { name: `<:oab_adv:1188267318875271168> | ${servidores[0].cargo} responsável`, value: `${interaction.user}` },
                    { name: `<:oab_data:1188268177063424050> | Data`, value: `${moment().format('LLLL')}` },
                    { name: `<:oab_policial:1187577592388272238> | Policial`, value: `${policial}` },
                    { name: `<:oab_reu:1187577589448060989> | Réu`, value: `${reu_nome} (Passaporte: ${reu_passaporte})` },
                    { name: `<:oab_algemas:1188269430388559892> | Prisão (motivo)`, value: `${prisao}` },
                    { name: `<:oab_veredito:1187577594472837171> | Veredito`, value: `${veredito}` }
                ])
                .setColor(cor_embed)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                .setFooter({ text: footer, iconURL: client.user.avatarURL() });
                
                // < Envia o caso no canal de casos-dp >
                client.channels.cache.get(casos_dp).send({ embeds: [embed] });
            })

        }
        else
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico, portanto, não pode utilizar este comando.` });
        }
	},
};
