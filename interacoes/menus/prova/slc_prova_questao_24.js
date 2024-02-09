/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "slc_prova_questao_24",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        
        // < Verifica a entrada >
        if (interaction.values[0] == "prova_matar_permitido")
        {
            resposta = "Sim";
        }
        else if (interaction.values[0] == "prova_matar_nao") 
        {
            resposta = "Não";
            
            // < Registra os pontos >
            pool.query(`SELECT * FROM provas WHERE discord_id = ${interaction.user.id}`, async function (erro, provas)
            {
                pool.query(`UPDATE provas SET pontos = (${provas[0].pontos} + 1)`);
            })
        }
        else if (interaction.values[0] == "prova_matar_talvez") 
        {
            resposta = "Talvez";
        }

        // < Registra a última resposta >
        pool.query(`UPDATE provas SET resposta_10 = '${resposta}'`);

        // < Respostas >
        const select = new StringSelectMenuBuilder()
        .setCustomId('slc_prova_questao_25')
        .setPlaceholder('Escolha sua resposta...')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('É obrigado a ficar calado')
                .setEmoji('1️⃣')
                .setValue('prova_lei_de_miranda_calado'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Pode realizar uma única ligação para o advogado')
                .setEmoji('2️⃣')
                .setValue('prova_lei_de_miranda_ligacao'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Somente pode falar com familiares')
                .setEmoji('3️⃣')
                .setValue('prova_lei_de_miranda_familiares'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Tudo que ele disser, não será levado como prova')
                .setEmoji('4️⃣')
                .setValue('prova_lei_de_miranda_dizer'),
        );

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.update({ content: `## <:oab_questao:1204999334853214260> Questão 2.5\n> Sobre a Lei de Miranda, o réu:`, components: [row] });
    },
};