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
const { forum_processos, cargo_juiz, cargo_everyone, categoria_adocao, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_adocao",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const crianca = interaction.fields.getTextInputValue('adocao_nome')
        const mae = interaction.fields.getTextInputValue('adocao_mae')
        const pai = interaction.fields.getTextInputValue('adocao_pai')
        const data = interaction.fields.getTextInputValue('adocao_data')
        const disponibilidade = interaction.fields.getTextInputValue('adocao_disponibilidade')

        // < Responde o usuário >
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\n<a:oab_carregando:1187884300264275968> Aguarde a criação do seu **processo**...`, ephemeral: true });

        // < Cria o canal do processo >
        pool.query(`SELECT COUNT(*) AS total_registros FROM adocoes`, async function (erro, adocoes)
        {
            pool.query(`SELECT * FROM servidores WHERE discord_id = ${interaction.user.id}`, async function (erro, servidores)
            {
                if (servidores.length == 0)
                {
                    return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Você não faz parte do corpo jurídico.`, ephemeral: true })
                }

                // < Coleta o total de processos do tipo adocoes >
                let total_registros = adocoes[0].total_registros;

                // < Embed e botões da mensagem do processo >
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.nickname, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`Processo de **Adoção Nº${total_registros+1}**.\n* Dr(a). ${interaction.user} (OAB: ${servidores[0].passaporte})`)
                .setColor(cor_embed)
                .addFields([
                    { name: `<:oab_crianca:1188547935579938936> | Criança/Adulto`, value: `\`\`\`txt\n${crianca}\`\`\`` },
                    { name: `<:oab_cliente:1188541685572051054> | Mãe`, value: `\`\`\`txt\n${mae}\`\`\``, inline: true },
                    { name: `<:oab_pai:1188548184780329051> | Pai`, value: `\`\`\`txt\n${pai}\`\`\``, inline: true },
                    { name: `<:oab_data:1188268177063424050> | Data da adoção`, value: `\`\`\`txt\n${data}\`\`\`` },
                    { name: `<:oab_relogio:1204997699586236436> | Disponibilidade`, value: `${disponibilidade}` },
                    { name: `<:oab_honorarios:1188497416173924444> | Honorários`, value: `R$ 900.000,00` },
                ])
                .setThumbnail(interaction.user.avatarURL({ size: 2048, dynamic: true }))
                .setFooter({ text: footer, iconURL: client.user.avatarURL() });

                // < Cria os dados no banco de dados >
                pool.query(`INSERT INTO adocoes (advogado, juiz, crianca, adulto, adotado, mae, pai, data_adocao, data_abertura, status, observacoes) VALUES (${interaction.user.id}, "Ninguém", 0, 0, "${crianca}", "${mae}", "${pai}", "${data}", NOW(), "Aberto", "Nenhuma")`);
                
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

                const btn_processo_laudo = new ButtonBuilder()
                .setCustomId('btn_processo_laudo')
                .setLabel(`Pendente Laudo Médico`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1208873105368555571`);
                
                const btn_processo_testemunhas = new ButtonBuilder()
                .setCustomId('btn_processo_testemunhas')
                .setLabel(`Agendar nova audiência`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1208873103908929607`);

                const btn_processo_assumir = new ButtonBuilder()
                .setCustomId('btn_processo_assumir')
                .setLabel(`Avocar processo`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`1187577598776193136`);

                const botao = new ActionRowBuilder()
                .addComponents(btn_processo_assumir, btn_processo_aprovado, btn_processo_rejeitado, btn_processo_laudo, btn_processo_testemunhas);
    
                // < Busca o fórum de processos >
                const channel = client.channels.cache.get(forum_processos);

                // < Cria a thread >
                channel.threads.create(
                { 
                    name: `Adoção Nº ${total_registros+1} | Dr(a). ${(interaction.member.nickname).replace(/(\d+|\|)/g, "")}`, 
                    message: { embeds: [embed], components: [botao] }, 
                    type: ChannelType.PrivateThread 
                }) 
                .then(async thread => 
                {
                    await thread.members.add(interaction.user.id);
                    await thread.send({ content: `## <:oab_aviso:1188557292073918555> Informes\nPrezado(a) ${interaction.user}, atente-se aos seguintes informes:\n1. Negocie com o(a) Juiz(a) que assumir o caso a **melhor data para acontecer a audiência**;\n2. informe se **o adotado é criança ou adulto **para que o(a) Juiz(a) saiba quantas audiências ocorrerão;\n3. envie as imagens da **transferência bancária** feita para o(a) Juiz(a); e\n4. envie as imagens do **F11** do **pai** e da **mãe**.` });
                    await interaction.editReply({ content: `# <:oab_balanca:1187577597173960754> Processo Judicial Eletrônico\nSeu processo de **Adoção** (ID: ${total_registros+1}) foi aberto com sucesso! Acesse em: <#${thread.id}>.`, ephemeral: true });
                });
            })
        })
    },
};