/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');

const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "slc_orcamento",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let valor_total, processos;
        
        valor_total = 0;
        processos = "`";

        for (let i = 0; i < interaction.values.length; i++)
        {
            if (interaction.values[i] == "orcamento_troca")
            {
                valor_total += 500000;
                processos += ` troca de nome `
            }
            else if (interaction.values[i] == "orcamento_adocao")
            {
                valor_total += 900000;
                processos += ` adoção `
            }
            else if (interaction.values[i] == "orcamento_casamento")
            {
                valor_total += 1250000;
                processos += ` casamento `
            }
            else if (interaction.values[i] == "orcamento_divorcio")
            {
                valor_total += 1500000;
                processos += ` divórcio `
            }
            else if (interaction.values[i] == "orcamento_certidao")
            {
                valor_total += 400000;
                processos += ` certidão de nascimento `
            }
            else if (interaction.values[i] == "orcamento_carteira")
            {
                valor_total += 400000;
                processos += ` carteira profissional `
            }
            else if (interaction.values[i] == "orcamento_audiencia")
            {
                valor_total += 500000;
                processos += ` audiência `
            }
            else if (interaction.values[i] == "orcamento_reset")
            {
                const select = new StringSelectMenuBuilder()
                .setCustomId('slc_orcamento')
                .setPlaceholder('Selecione os processos...')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Resetar escolha')
                        .setDescription('Tira a escolha selecionada anteriormente.')
                        .setEmoji('1202096934093852732')
                        .setValue('orcamento_reset'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Troca de nome')
                        .setEmoji('1188542389179133992')
                        .setValue('orcamento_troca'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Adoção')
                        .setEmoji('1188547935579938936')
                        .setValue('orcamento_adocao'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Casamento')
                        .setEmoji('1189409204834943066')
                        .setValue('orcamento_casamento'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Divórcio')
                        .setEmoji('1205396904020811776')
                        .setValue('orcamento_divorcio'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Certidão de nascimento')
                        .setEmoji('1202100213485928528')
                        .setValue('orcamento_certidao'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Carteira Profssional')
                        .setEmoji('1189405031515029615')
                        .setValue('orcamento_carteira'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Audiência')
                        .setEmoji('1188556234551464026')
                        .setValue('orcamento_audiencia'),
                )
                .setMinValues(1)
                .setMaxValues(7);

                const menu = new ActionRowBuilder()
                    .addComponents(select);
                
                return await interaction.update({ components: [menu] });
            }
        }
        
        processos += "`";

        await interaction.reply({ content: `# <:oab_honorarios2:1205644366899847228> Honorários\n* Processos: ${processos}\n* **Valor a ser cobrado:** R$ ${valor_total.toLocaleString('pt-BR')},00`, ephemeral: true });
    },
};