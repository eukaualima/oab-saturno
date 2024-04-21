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
const { categoria_fechados, cargo_juiz, cargo_everyone, canal_vereditos_mandado, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

module.exports = 
{
	id: "mdl_mandado_aprovado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Coleta as informações passadas no modal >
        const motivo = interaction.fields.getTextInputValue('motivo_aprovacao')
        const codigo = interaction.fields.getTextInputValue('codigo_mandado')

        // < Busca o processo marcado >
        pool.query(`SELECT * FROM mandados WHERE codigo = ${codigo}`, async function (erro, processo)
        {
            if (processo[0].status == "Fechado")
            {
                return interaction.reply({ content: `<:oab_error:1187428311014576208> **|** Este processo já foi resolvido.`, ephemeral: true })
            }

            await interaction.update({ components: [] });
            
            // < Atualiza o status do processo no banco de dados >
            pool.query(`UPDATE mandados SET status = "Deferido" WHERE codigo = ${codigo}`);
            pool.query(`UPDATE mandados SET observacoes = "${motivo ? motivo : "Não informado pelo juiz(a)."}" WHERE codigo = ${codigo}`);

            // < Coleta o necessário para finalizar o processo >
            let vereditos = await interaction.guild.channels.cache.get(canal_vereditos_mandado);
            let advogado_user = await interaction.guild.members.fetch(processo[0].policial);

            await interaction.channel.edit({ name: `[Fechado][Deferido] mandado#${codigo}` });
            await interaction.channel.setLocked(true)
            
            // < Sistema de "Vereditos" >
            const veredito_embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`* **Identificação do mandado:** mandado#${codigo}\n* **Policial:** Sr(a). ${advogado_user}\n* **Juiz(a):** Exmo(a). ${interaction.user}`)
            .setColor(cor_embed)
            .addFields([
                { name: `<:oab_veredito:1187577594472837171> | Veredito`, value: `Mandado **DEFERIDO**.` },
                { name: `<:oab_email:1187883019667779617> | Observações`, value: `${motivo ? motivo : "Nenhuma."}` },
                { name: `<:oab_data:1188268177063424050> | Data de fechamento`, value: `${moment().format('LLLL')}` },
            ])
            .setThumbnail(client.user.avatarURL({ size: 1024 }))
            .setImage('https://i.imgur.com/QbA1Byq.png')
            .setFooter({ text: footer, iconURL: client.user.avatarURL() });
            

            // < Cria o botãos >
            const btn_processo_excluir = new ButtonBuilder()
            .setCustomId('btn_processo_excluir')
            .setLabel(`Excluir`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`1208285382634897491`);

            const botao = new ActionRowBuilder()
            .addComponents(btn_processo_excluir);

            // await vereditos.send({ content: `## <:oab_veredito:1187577594472837171> Veredito\nO(a) juiz(a) **${interaction.user}** acaba de **aprovar** o processo de <@${processo[0].advogado}>.\n### <:oab_juiz:1187577598776193136> Observações\n${motivo ? motivo : "Nenhuma."}\n\n* O identificador deste processo é *${natureza}#${codigo}*.` });
            await vereditos.send({ content: `${advogado_user}`, embeds: [veredito_embed] });
            await interaction.channel.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Mandado\nMandado **fechado**, **trancado** e **arquivado**.\n## <:oab_juiz:1187577598776193136> Juiz(a) responsável\n${interaction.user}\n## <:oab_email:1187883019667779617> Observações\n${motivo ? motivo : "Nenhuma."}\n### <:oab_anuncio:1202084582992924692> Veredito publicado\n<#${canal_vereditos_mandado}>`, components: [botao] })
            await interaction.channel.setArchived(true)
        })
    },
};