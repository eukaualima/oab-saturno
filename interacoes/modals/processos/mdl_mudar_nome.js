/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { cargo_juiz, cargo_everyone, categoria_trocas, forum_processos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_mudar_nome",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const nome_antigo = interaction.fields.getTextInputValue('mudar_nome_antigo')
        const nome_novo = interaction.fields.getTextInputValue('mudar_nome_novo')
        const passaporte = interaction.fields.getTextInputValue('mudar_nome_passaporte')
        const motivo = interaction.fields.getTextInputValue('mudar_nome_motivo')

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\n<a:oab_carregando:1187884300264275968> Aguarde a criação do seu **processo**...`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM trocas`, async function (erro, trocas)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }
                // < Coleta o total de processos do tipo trocas >
                let total_registros = trocas[0].total_registros;
                
                let honorarios, extra;
                
                pool.query(`SELECT * FROM isentos WHERE passaporte = ${passaporte}`, async function (erro, isentos)
                {
                    if (isentos.length == 0)
                    {
                        honorarios = "R$ 500.000,00";
                        extra = `# <:oab_aviso:1188557292073918555> Anexos\n${interaction.user}, envie abaixo:\n1. **Comprovante da transferência** feita ao(à) Juiz(a) responsável; e\n2. imagem da **pesquisa no MDT**.\n\n* Ao enviar, **marque o cargo Juiz(a)** e aguarde o retorno.`
                    }
                    else
                    {
                        honorarios = "R$ 250.000,00";
                        extra = `# <:oab_aviso:1188557292073918555> Anexos\n${interaction.user}, envie abaixo:\n1. imagem da **pesquisa no MDT**.\n\n* Este(a) é um(a) policial investigativo(a), **apenas você recebe os honorários**.\n* Ao enviar, **marque o cargo Juiz(a)** e aguarde o retorno.`;
                    }

                    const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.member.nickname, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`Processo de **Troca de Nome Nº${total_registros+1}**.\n* Dr(a). ${interaction.user} (OAB: ${servidores[0].passaporte})`)
                    .setColor(cor_embed)
                    .addFields([
                        { name: `<:oab_cliente:1188541685572051054> | Nome antigo`, value: `\`\`\`txt\n${nome_antigo}\`\`\``, inline: true },
                        { name: `<:oab_editar:1205643996806910064> | Novo nome`, value: `\`\`\`txt\n${nome_novo}\`\`\``, inline: true },
                        { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `\`\`\`js\n${passaporte}\`\`\`` },
                        { name: `<:oab_escrita:1188542389179133992> | Motivo`, value: `${motivo}` },
                        { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `${honorarios}`, inline: true },
                    ])
                    .setThumbnail(interaction.user.avatarURL({ size: 2048, dynamic: true }))
                    .setFooter({ text: footer, iconURL: client.user.avatarURL() });
                    
                    
                    // < Cria os botões >
                    const btn_processo_aprovado = new ButtonBuilder()
                    .setCustomId('btn_processo_aprovado')
                    .setLabel(`Deferir processo`)
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`1187577594472837171`);
                    
                    const btn_processo_rejeitado = new ButtonBuilder()
                    .setCustomId('btn_processo_rejeitado')
                    .setLabel(`Indeferir processo`)
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`1187577594472837171`);

                    const btn_processo_assumir = new ButtonBuilder()
                    .setCustomId('btn_processo_assumir')
                    .setLabel(`Avocar processo`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`1187577598776193136`);

                    const botao = new ActionRowBuilder()
                    .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado);

                    // < Busca o fórum de processos >
                    const channel = client.channels.cache.get(forum_processos);

                    channel.threads.create(
                    { 
                        name: `Troca Nº ${total_registros+1} | Dr(a). ${(interaction.member.nickname).replace(/(\d+|\|)/g, "")}`, 
                        message: { embeds: [embed], components: [botao] }, 
                        type: ChannelType.PrivateThread 
                    }) 
                    .then(async thread => 
                    {
                        // < Cria os dados no banco de dados >
                        pool.query(`INSERT INTO trocas (advogado, juiz, cliente_nome, cliente_id, novo_nome, motivo, data, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", "${nome_antigo}", ${passaporte}, "${nome_novo}", "${motivo}", NOW(), "Aberto", "Nenhuma")`);
                        
                        await thread.members.add(interaction.user.id);
                        await thread.send({ content: `${extra}` });
                        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\nSeu processo de **Troca de Nome** (ID: ${total_registros+1}) foi aberto com sucesso! Acesse em: <#${thread.id}>.`, ephemeral: true });
                    })
                });
            });
        });
    },
};