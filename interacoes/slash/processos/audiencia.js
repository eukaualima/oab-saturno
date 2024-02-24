/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment-timezone');
const { footer, casos_dp, cor_embed, cargo_advogado, cargo_estagiario, cargo_juiz, cargo_adm } = require("../../../config.json");

moment.tz('America/Sao_Paulo')

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("audiencia")
    .setDescription("Marque uma audiência.")
    .addStringOption(option =>
        option
        .setName("processo")
        .setDescription("Qual tipo de processo será a audiência?")
        .addChoices(
            { name: `Audiência trabalhista/criminal`, value: `marcar_audiencias` },
            { name: `Audiência de Adoção`, value: `marcar_adocoes` },
            { name: `Audiência de Casamento`, value: `marcar_casamentos` },
            { name: `Audiência de Divórcio`, value: `marcar_divorcios` },
        )
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName("dia")
        .setDescription("Qual será o dia da audiência?")
        .setMinValue(1)
        .setMaxValue(31)
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName("mes")
        .setDescription("Qual será o mês da audiência?")
        .setMinValue(1)
        .setMaxValue(12)
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName("hora")
        .setDescription("Que horas será a audiência? (Formato 24h)")
        .setMinValue(0)
        .setMaxValue(24)
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName("minuto")
        .setDescription("Se for hora fechada, digite 0.")
        .setMinValue(0)
        .setMaxValue(59)
        .setRequired(true)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Coleta os dados passados no comando >
        const processo = interaction.options.getString("processo");
        const dia = interaction.options.getInteger("dia");
        const mes = interaction.options.getInteger("mes");
        const minuto = interaction.options.getInteger("minuto");
        const hora = interaction.options.getInteger("hora");

        // < Coleta o código do processo >
        const codigo = interaction.channel.name.replace(/[^0-9]/g,'');

        if (!codigo)
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Este não é um canal de processo.` });
        }

        // < Formata a hora >
        let data = new Date(2024, mes - 1, dia, hora, minuto);

        // Formata a data e hora no formato desejado
        let data_formatada = data.toISOString().slice(0, 19).replace('T', ' ');

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_adm))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Lógica do comando >
        if (processo == "marcar_adocoes")
        {
            pool.query(`UPDATE adocoes SET data_audiencia = '${data_formatada}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE adocoes SET canal = '${interaction.channel.id}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE adocoes SET lembrete = 0 WHERE codigo = ${codigo}`);

            pool.query(`SELECT * FROM adocoes WHERE codigo = ${codigo}`, async function (erro, processo)
            {
                return interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), designa a data de **${moment(data_formatada).format("LLLL")}** para a realização da **audiência de instrução e julgamento**, nos autos do processo de Adoção **nº ${codigo}**.` });
            })
        }
        else if (processo == "marcar_audiencias")
        {
            pool.query(`UPDATE audiencias SET data_audiencia = '${data_formatada}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE audiencias SET canal = '${interaction.channel.id}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE audiencias SET lembrete = 0 WHERE codigo = ${codigo}`);

            pool.query(`SELECT * FROM audiencias WHERE codigo = ${codigo}`, async function (erro, processo)
            {
                return interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), designa a data de **${moment(data_formatada).format("LLLL")}** para a realização da **audiência de instrução e julgamento**, nos autos do processo de Audiência Criminal/Trabalhista **nº ${codigo}**.` });
            })
        }
        else if (processo == "marcar_casamentos")
        {
            pool.query(`UPDATE casamentos SET data_casamento = '${data_formatada}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE casamentos SET canal = '${interaction.channel.id}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE casamentos SET lembrete = 0 WHERE codigo = ${codigo}`);

            pool.query(`SELECT * FROM casamentos WHERE codigo = ${codigo}`, async function (erro, processo)
            {
                return interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), designa a data de **${moment(data_formatada).format("LLLL")}** para a realização da **audiência de instrução e julgamento**, nos autos do processo de Casamento **nº ${codigo}**.` });
            })
        }
        else if (processo == "marcar_divorcios")
        {
            pool.query(`UPDATE divorcios SET data_audiencia = '${data_formatada}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE divorcios SET canal = '${interaction.channel.id}' WHERE codigo = ${codigo}`);
            pool.query(`UPDATE divorcios SET lembrete = 0 WHERE codigo = ${codigo}`);

            pool.query(`SELECT * FROM divorcios WHERE codigo = ${codigo}`, async function (erro, processo)
            {
                return interaction.editReply({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), designa a data de **${moment(data_formatada).format("LLLL")}** para a realização da **audiência de instrução e julgamento**, nos autos do processo de Divórcio **nº ${codigo}**.` });
            })
        }
	},
};
