/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, Collection, PermissionsBitField, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const pool = require('../../../conexao/mysql');
const { cargo_juiz } = require('../../../config.json');

// < Inicia o botão >
module.exports = 
{
	id: "btn_processo_testemunhas",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta o código do processo no nome do canal >
        const codigo = interaction.channel.name.replace(/[^0-9]/g,'');

        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este recurso.`, ephemeral: true })
        }
        
        // < Faz a busca no banco de dados >
        pool.query(`SELECT * FROM adocoes WHERE codigo = ${codigo}`, async function (erro, adocoes)
        {
            // < Cria os botões >
            const btn_processo_aprovado = new ButtonBuilder()
            .setCustomId('btn_processo_aprovado')
            .setLabel(`Deferir processo`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`1187577594472837171`);

            const btn_processo_rejeitado = new ButtonBuilder()
            .setCustomId('btn_processo_rejeitado')
            .setLabel(`Indeferir processo`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1187577594472837171`);

            const btn_processo_laudo = new ButtonBuilder()
            .setCustomId('btn_processo_laudo')
            .setLabel(`Laudo Médico solicitado`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`1187428122988126348`);
            
            const btn_processo_testemunhas = new ButtonBuilder()
            .setCustomId('btn_processo_testemunhas')
            .setLabel(`Nova data solicitada`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`1187428122988126348`);

            const btn_processo_assumir = new ButtonBuilder()
            .setCustomId('btn_processo_assumir')
            .setLabel(`${interaction.member.nickname}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`1187577598776193136`);

            const botoes = new ActionRowBuilder()
            .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado, btn_processo_laudo, btn_processo_testemunhas);

            await interaction.update({ components: [botoes] })
            await interaction.channel.send({ content: `## <:oab_agendar:1208873103908929607> Audiência de oitiva de testemunhas\nPrezado(a) Dr(a). <@${adocoes[0].advogado}>, o Juízo solicita que **os pais da criança indiquem**, no prazo de **24 horas**, uma nova data para a **oitiva de testemunhas**, informando o **nome completo** e **número do passaporte** das **duas testemunhas** a serem ouvidas.` });
        })
    },
};