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
    .setName("cmensagem")
    .setDescription("Faz o sistema OAB enviar uma mensagem em um canal.")
    .addStringOption(option =>
        option
        .setName("id")
        .setDescription("Informe o id do processo.")
        .setRequired(true)),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        // < Declaração de variáveis locais >
        let desenvolvedor, mensagem, id;

        id = interaction.options.getString("id");

        desenvolvedor = "513880665754828800";

        if (interaction.user.id != desenvolvedor)
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas o **desenvolvedor** do sistema tem acesso a este comando.` })
        }

        mensagem = `# <:oab_logo:1202096934093852732> Solicitação de Mandado de Prisão\n* Caso tenha alguma dúvida, acesse o canal <#1230697097083224187>\n* Caso ocorra algum erro, mencione <@513880665754828800> e aguarde a solução.`;
        // mensagem = `# <:oab_logo:1202096934093852732> Prova da OAB\nAbaixo, inscreva-se para fazer parte do **Corpo Jurídico** da cidade Saturno RP.\n* Antes de iniciar a prova, saiba:\n * **Não há tempo limite**, portanto, responda com **paciência**;\n * Leia com atenção e selecione a opção que você julga ser **correta**;\n * São **14 questões** ao todo e apenas **12** são avaliativas;\n * Você **será respondido(a) **sobre a aprovação/reprovação **em até 24h** no canal <#${canal_resultados}>.`;
        // < Botão >
        const btn_processo = new ButtonBuilder()
        .setCustomId(`btn_${id}`)
        .setLabel(`Solicitar Mandado`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji(`1187883019667779617`);

        const botao = new ActionRowBuilder()
        .addComponents(btn_processo);

        // < Envia a mensagem no canal >
        // interaction.editReply({ content: `Mensagem enviada com sucesso.`, ephemeral: true })

        //  const select = new StringSelectMenuBuilder()
        //  .setCustomId('slc_abrir_processo')
        //  .setPlaceholder('Selecione um processo...')
        //  .addOptions(
        //     new StringSelectMenuOptionBuilder()
        //             .setLabel('Resetar escolha')
        //             .setDescription('Tira a escolha selecionada anteriormente.')
        //             .setEmoji('1202096934093852732')
        //             .setValue('abrir_reset'),
                    
        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Troca de nome')
        //         .setDescription('Solicite a Troca de Nome do(a) seu/sua cliente.')
        //         .setEmoji('1188542389179133992')
        //         .setValue('abrir_troca'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Limpeza de Ficha Criminal')
        //         .setDescription('Solicite a Limpeza de Ficha Criminal do(a) seu/sua cliente.')
        //         .setEmoji('1205396901575270411')
        //         .setValue('abrir_limpeza'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Adoção')
        //         .setDescription('Marque a audiência de Adoção do(a) seu/sua cliente.')
        //         .setEmoji('1188547935579938936')
        //         .setValue('abrir_adocao'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Audiência')
        //         .setDescription('Marque a audiência do(a) seu/sua cliente.')
        //         .setEmoji('1188556234551464026')
        //         .setValue('abrir_audiencia'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Casamento')
        //         .setDescription('Solicite o Casamento do(a) seu/sua cliente.')
        //         .setEmoji('1189409204834943066')
        //         .setValue('abrir_casamento'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Divórcio')
        //         .setDescription('Solicite o Divórcio do(a) seu/sua cliente.')
        //         .setEmoji('1205396904020811776')
        //         .setValue('abrir_divorcio'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Carteira Profissional')
        //         .setDescription('Solicite a Carteira Profissional do(a) seu/sua cliente.')
        //         .setEmoji('1189405031515029615')
        //         .setValue('abrir_carteira_profissional'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Certidão de Nascimento')
        //         .setDescription('Solicite a Certidão de Nascimento do(a) seu/sua cliente.')
        //         .setEmoji('1202100213485928528')
        //         .setValue('abrir_certidao'),

        //     new StringSelectMenuOptionBuilder()
        //         .setLabel('Carteira OAB')
        //         .setDescription('Solicite a sua Carteira de Identificação OAB.')
        //         .setEmoji('1188267318875271168')
        //         .setValue('abrir_carteira'),
        //  );
 
        //  const row = new ActionRowBuilder()
        //      .addComponents(select);

        // await interaction.editReply({ content: `Mensagem criada!` }).then(msg => msg.delete());
        await interaction.channel.send({ content: `${mensagem}`, components: [botao] });
	},
};
