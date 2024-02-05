/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment');
const { footer, cor_embed } = require("../../../config.json");

moment.locale('pt-BR');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("artigos")
    .setDescription("Verifique os artigos que estão listados no MDT atual."),
    // < Executa o comando >
	async execute(interaction, client) 
    {
                let mensagem = `## <:oab_arquivo:1203930183199887410> Artigos 4 a 12\n* *Ao usar os artigos, **verifique com o(a) policial ou no MDT** se ainda é válido.*\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 4: Vandalismo\n* **Pena:** 10 meses\n* **Multa:** R$ 10.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 7: Resistência à prisão\n* **Pena:** 10 meses\n* **Multa:** R$ 20.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 8: Tentativa de fuga\n* **Pena:** 10 meses\n* **Multa:** R$ 10.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 9: Ameaça\n* **Pena:** 15 meses\n* **Multa:** R$ 20.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 10: Lesão corporal\n* **Pena:** 15 meses\n* **Multa:** R$ 30.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 11: Desacato à Servidor Público\n* **Pena:** 15 meses\n* **Multa:** R$ 20.000,00\n` +
                `### <:oab_escrita:1188542389179133992> Artigo 12: Desobediência à Ordem Policial\n* **Pena:** 15 meses\n* **Multa:** R$ 20.000,00\n`;
                
                // < Cria o menu de seleção >
                const select = new StringSelectMenuBuilder()
                .setCustomId('artigos')
                .setPlaceholder('Selecionar intervalo...')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Artigos 13-19')
                        .setDescription('Veja os Artigos do 13 ao 19.')
                        .setValue('artigos_1'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Charmander')
                        .setDescription('The Fire-type Lizard Pokémon.')
                        .setValue('charmander'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Squirtle')
                        .setDescription('The Water-type Tiny Turtle Pokémon.')
                        .setValue('squirtle'),
                );

                // < Responde o usuário >
                await interaction.editReply({ content: `${mensagem}` });
	},
};
