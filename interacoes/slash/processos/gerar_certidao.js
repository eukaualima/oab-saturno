/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas')
const { cargo_juiz } = require('../../../config.json');

// < Função para deixar o texto dentro da imagem >
const redenizarTexto = (canvas, text, fonte, fonte_nome) => 
{
    const dimensao = canvas.getContext('2d');

    let tamanho = fonte;

    do 
    {
        dimensao.font = `${tamanho -= 5}px ${fonte_nome}`;
    } while (dimensao.measureText(text).width > canvas.width - 300);

    return dimensao.font;
}

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("gcertidao")
    .setDescription("Faça o registro de uma Certidão de Nascimento.")
    .addStringOption(option =>
        option
        .setName("nome")
        .setDescription("Informe o nome da pessoa nascida.")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("data")
        .setDescription("Informe a data que a pessoa nasceu. Exemplo: 23 de dezembro de 1998")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("pais")
        .setDescription("Informe o nome dos pais da pessoa nascida. Exemplo: Estevão Martins e Ana Martins")
        .setRequired(true)),


    // < Executa o comando >
	async execute(interaction) 
    {
        // < Declaração de variáveis locais >
        let nome, data, pais;

        // < Coleta os nomes enviados pelo comando >
        nome = interaction.options.getString("nome");
        data = interaction.options.getString("data");
        pais = interaction.options.getString("pais");

        // < Verifica se o usuário é juiz >
        if (!interaction.member.roles.cache.some(cargo => cargo.id == cargo_juiz))
        {
            return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Apenas **juízes** podem utilizar este comando.` });
        }

        // < Cria o esboço da imagem >
        const canvas = Canvas.createCanvas(725, 1024);
        const dimensao = canvas.getContext("2d");

        // < Carrega a imagem de fundo >
        const modelo = await Canvas.loadImage('https://i.imgur.com/yoKYqn7.png');

        interaction.editReply({ content: `<a:oab_carregando:1187884300264275968> **|** Gerando a certidão de **${nome}**...` }).then(async () => {
            // < Desenha a imagem de fundo >
            dimensao.drawImage(modelo, 0, 0, canvas.width, canvas.height);
            
            // < Cores do texto >
            dimensao.fillStyle = '#000000';
            dimensao.strokeStyle = '#000000';
            
            // < Insere o texto na imagem >
            dimensao.font = redenizarTexto(canvas, nome, 70, "Archivo Black");
            dimensao.fillText(nome, 175, 374);
    
            dimensao.font = redenizarTexto(canvas, data, 25, "Arial");
            dimensao.fillText(data, 193, 451);
            
            dimensao.font = redenizarTexto(canvas, pais, 100, "Archivo Black");
            dimensao.fillText(pais, 148, 576);
    
            dimensao.strokeRect(0, 0, canvas.width, canvas.height);
    
            // < Cria a imagem para ser enviada ao usuário >
            const certidao = new AttachmentBuilder(await canvas.encode('png'), { name: 'certidao.png' });
    
            // < Responde o comando com a imagem pronta >
            interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** A certidão de **${nome}** foi gerada com sucesso!`, files: [certidao] });
        })
	},
};