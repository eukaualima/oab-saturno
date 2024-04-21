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
        let natureza = interaction.channel.name.split(" ")[0];
        const codigo = interaction.channel.name.split(" ")[2];

        // < Verifica se o usuário é um juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem avaliar e dar o veredito sobre o caso.`, ephemeral: true })
        }

        if (natureza == "Certidão")
        {
            natureza = "certidoes";
        }
        else if (natureza == "Adoção")
        {
            natureza = "adocoes";
        }
        else if (natureza == "Audiência")
        {
            natureza = "audiencias";
        }
        else if (natureza == "Divórcio")
        {
            natureza = "divorcios";
        }
        else
        {
            natureza = natureza.toLowerCase() + 's';
        }

        pool.query(`SELECT * FROM ${natureza} WHERE codigo = ${codigo}`, async function (erro, processo)
        {
            if (processo[0].juiz == "Ninguém")
            {
                pool.query(`UPDATE ${natureza} SET juiz = ${interaction.user.id} WHERE codigo = ${codigo}`);

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

                const btn_processo_laudo = new ButtonBuilder()
                .setCustomId('btn_processo_laudo')
                .setLabel(`Pendente Laudo Médico`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1208873105368555571`);
                        
                const btn_processo_testemunhas = new ButtonBuilder()
                .setCustomId('btn_processo_testemunhas')
                .setLabel(`Agendar nova audiência`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1208873103908929607`);

                const btn_processo_foto = new ButtonBuilder()
                .setCustomId('btn_processo_foto')
                .setLabel(`Solicitar foto`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`📸`);

                const btn_processo_assumir = new ButtonBuilder()
                .setCustomId('btn_processo_assumir')
                .setLabel(`${interaction.member.nickname}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1187577598776193136`);

                const btn_processo_advogado = new ButtonBuilder()
                .setCustomId('btn_processo_advogado')
                .setLabel(`Alterar advogado(a)`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(`1215170641863512074`);

                if (natureza == "adocoes")
                {
                    const botoesLinha1 = new ActionRowBuilder().addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);
                    const botoesLinha2 = new ActionRowBuilder().addComponents(btn_processo_laudo, btn_processo_testemunhas, btn_processo_advogado);

                    interaction.update({ components: [botoesLinha1, botoesLinha2] });
                    
                    return interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), acaba de **avocar** o processo.` });
                }
                else if (natureza == "carteiras")
                {
                    const botoes = new ActionRowBuilder().addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado, btn_processo_foto, btn_processo_advogado);
                    
                    await interaction.update({ components: [botoes] });
                    
                    return interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), acaba de **avocar** o processo.` });
                }
                else
                {
                    const botoes = new ActionRowBuilder().addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado, btn_processo_advogado);
                    
                    await interaction.update({ components: [botoes] });
                    
                    return interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\n<@${processo[0].advogado}>, o(a) Exmo(a). Sr(a). Dr(a). **${interaction.member.nickname}**, Juiz(a), acaba de **avocar** o processo.` });
                }
            }
        })
    },
};