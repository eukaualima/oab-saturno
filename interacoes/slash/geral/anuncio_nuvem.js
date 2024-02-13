/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { cor_embed, footer, canal_anuncios } = require(`../../../config.json`)

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
        .setName("anuncio")
        .setDescription("Envie o anúncio que utiliza para chamar clientes na cidade.")
        .addStringOption(option =>
            option
            .setName("texto")
            .setDescription("Informe o texto do anúncio.")
            .setRequired(true)
        ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const texto = interaction.options.getString("texto");

        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Sugerido por: ' + interaction.member.nickname, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle(`<:oab_anuncio:1202084582992924692> Anúncio`)
        .setDescription(`Abaixo uma sugestão de anúncio para ser usado dentro da cidade e encontrar clientes!\n**__💡 Dica:__** no computador, passe o mouse sobre a caixa abaixo e depois clique no botão de cópia!\n\`\`\`txt\n${texto}\`\`\``)
        .setColor(cor_embed)
        // .setThumbnail(client.user.avatarURL({ size: 1024 }))
        .setFooter({ text: `${footer}`, iconURL: client.user.avatarURL() });

        const canal = client.channels.cache.get(`${canal_anuncios}`);

        await canal.send({ embeds: [embed] });
        
        await interaction.editReply({ content: `<:oab_check:1187428122988126348> | Seu anúncio foi enviado com sucesso no canal <#${canal_anuncios}>!` })
	},
};
