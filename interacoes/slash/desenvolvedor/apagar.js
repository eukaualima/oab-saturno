/**
 * @file Comando para criar mensagens em um canal específico.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const { canal_resultados, canal_ajuda } = require('../../../config.json');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("apagar")
    .setDescription("Faz o sistema OAB apagar canais de processos fechados."),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        desenvolvedor = "513880665754828800";

        if (interaction.user.id != desenvolvedor)
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas o **desenvolvedor** do sistema tem acesso a este comando.` })
        }
        
        await interaction.editReply({ content: `### <:oab_veredito:1187577594472837171> | Todos os canais de processo finalizados serão apagados!` })
        
        let canaisDeletados = 0;
        
        await interaction.guild.channels.cache.forEach(async channel => {
            if (channel.name.includes('fechado-')) {
                await channel.delete()
                    .then(deletedChannel => {
                        interaction.channel.send({ content: `<:oab_aviso:1188557292073918555> | **${deletedChannel.name}** foi deletado com sucesso!` });
                        canaisDeletados++;
                    })
                    .catch(error => console.error(`Erro ao deletar canal ${channel.name}:`, error));
            }
        });

        await new Promise(resolve => setTimeout(resolve, 60000));

        await interaction.channel.send(`<:oab_check:1187428122988126348> | Foram deletados **${canaisDeletados}** canais.`);
	},
};
