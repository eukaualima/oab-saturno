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
	id: "btn_processo_assumir",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta os dados do processo >
        let natureza = interaction.channel.name.replace(/[^a-zA-Z]/g,'') + 's';
        const codigo = interaction.channel.name.replace(/[^0-9]/g,'');

        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem avaliar e dar o veredito sobre o caso.`, ephemeral: true })
        }

        if (natureza == "certidaos")
        {
            natureza = "certidoes";
        }
        else if (natureza == "adocaos")
        {
            natureza = "adocoes";
        }
        pool.query(`SELECT * FROM ${natureza} WHERE codigo = ${codigo}`, async function (erro, processo)
        {
            if (processo[0].juiz == "Ninguém")
            {
                pool.query(`UPDATE ${natureza} SET juiz = ${interaction.user.id} WHERE codigo = ${codigo}`);

                // client.users.cache.get(processo[0].advogado).send({ content: `## <:oab_juiz:1187577598776193136> Status do processo\nO(a) excelentíssimo(a) Juiz(a) ${interaction.user} acabou de assumir seu processo.` })

                // < Instancia os botões >
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

                const btn_processo_assumir = new ButtonBuilder()
                .setCustomId('btn_processo_assumir')
                .setLabel(`${interaction.member.nickname}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1187577598776193136`);
                
                const botoes = new ActionRowBuilder().addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);

                await interaction.update({ components: [botoes] });
                
                return interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), acaba de **avocar** o processo.` });
            }
        })
    },
};