/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { Permissions, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_prova",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles, CreatePublicThreads, CreatePrivateThreads } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const passaporte = interaction.fields.getTextInputValue('prova_passaporte');
        const nome = interaction.fields.getTextInputValue('prova_nome');
        const numero = interaction.fields.getTextInputValue('prova_numero');
        const idade = interaction.fields.getTextInputValue('prova_idade');

        // < Abre o canal da prova >
        await interaction.guild.channels.create(
        { 
            name: `prova-${nome}`,
            type: ChannelType.GuildText,
            parent: categoria_prova,
            permissionOverwrites: 
            [
                {
                    id: cargo_juiz,
                    allow: [ViewChannel, SendMessages, AttachFiles]
                },
                {
                    id: interaction.user.id,
                    allow: [ViewChannel],
                    deny: [AttachFiles, SendMessages, CreatePrivateThreads, CreatePublicThreads]
                },
                {
                    id: cargo_everyone,
                    deny: [ViewChannel, SendMessages, AttachFiles]
                }
            ]
        }).then(async canal => 
        {
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`Prova de **${interaction.member.nickname}** iniciada com sucesso.`)
            .setColor(cor_embed)
            .addFields([
                { name: `<:oab_cliente:1188541685572051054> | Candidato(a)`, value: `${nome}`, inline: true },
                { name: `<:oab_passaporte:1188496362334072882> | Passaporte`, value: `${passaporte}`, inline: true },
                { name: `<:oab_celular:1204990954277445643> | Número`, value: `${numero}` },
                { name: `<:oab_idade:1204991690151165962> | Idade`, value: `${idade}` },
            ])
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: footer, iconURL: client.user.avatarURL() });

            // < Cria os dados no banco de dados >
            pool.query(`INSERT INTO provas (discord_id, nome, passaporte, numero, idade, resposta_1, resposta_2, resposta_3, resultado, juiz) VALUES (${interaction.user.id}, "${nome}", "${passaporte}", "${numero}", "${idade}", "Nada consta.", "Nada consta.", "Nada consta.", "Em análise", "Ninguém")`);
            
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Prova iniciada com sucesso! Acesse-a no canal <#${canal.id}>.`, ephemeral: true });
            
            // < Cria os botões >
            const btn_prova_aprovada = new ButtonBuilder()
            .setCustomId('btn_prova_aprovado')
            .setLabel(`Aprovar prova`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`1187577594472837171`);

            const btn_prova_rejeitada = new ButtonBuilder()
            .setCustomId('btn_prova_rejeitado')
            .setLabel(`Rejeitar prova`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1187577594472837171`);

            const btn_prova_assumir = new ButtonBuilder()
            .setCustomId('btn_prova_assumir')
            .setLabel(`Assumir prova`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`1187577598776193136`);

            const botao = new ActionRowBuilder()
            .addComponents(btn_prova_assumir, btn_prova_aprovada, btn_prova_rejeitada);

            await canal.send({ embeds: [embed], components: [botao] });

            // < A prova >
            const btn_prova_experiencia_sim = new ButtonBuilder()
            .setCustomId('btn_prova_experiencia_sim')
            .setLabel(`Sim`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`1187428122988126348`);

            const btn_prova_experiencia_nao = new ButtonBuilder()
            .setCustomId('btn_prova_experiencia_nao')
            .setLabel(`Não`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1187428311014576208`);

            const botoes = new ActionRowBuilder()
            .addComponents(btn_prova_experiencia_sim, btn_prova_experiencia_nao);

            // < Informe >
            await canal.send({ content: `# <:oab_livro:1204999345544372264> Parte 1 - Questões pessoais\n## <:oab_questao:1204999334853214260> Questão 1.0\n> Tem **experiência** como **advogado(a)** em RP?`, components: [botoes] });
        })
    },
};