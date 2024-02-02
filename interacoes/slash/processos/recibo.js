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
    .setName("recibo")
    .setDescription("Recibo para enviar ao cliente após receber honorários.")
    .addStringOption(option =>
        option
        .setName("cliente")
        .setDescription("Nome do cliente.")
        .setRequired(true))
    .addNumberOption(option =>
        option
        .setName("advogado_recebeu")
        .setDescription("Informe quanto você recebeu.")
        .setRequired(true)
        .setMinValue(1))
    .addNumberOption(option =>
        option
        .setName("juiz_recebeu")
        .setDescription("Informe quanto o juiz recebeu.")
        .setRequired(true)
        .setMinValue(1))
    .addNumberOption(option =>
        option
        .setName("total")
        .setDescription("Informe o honorário total.")
        .setRequired(true)
        .setMinValue(1))
    .addStringOption(option =>
        option
        .setName("sua_assinatura")
        .setDescription("Informe o seu nome.")
        .setMinLength(3)
        .setRequired(true)),

    // < Executa o comando >
	async execute(interaction) 
    {
        // < Declaração de variáveis locais >
        let nome, advogado, juiz, total, assinatura;

        // < Coleta os nomes enviados pelo comando >
        nome = interaction.options.getString("cliente");
        advogado = interaction.options.getNumber("advogado").toLocaleString("pt-BR") + ",00";
        juiz = interaction.options.getNumber("juiz").toLocaleString("pt-BR") + ",00";
        total = interaction.options.getNumber("total").toLocaleString("pt-BR") + ",00";
        assinatura = interaction.options.getString("assinatura");
        
        // < Cria o esboço da imagem >
        const canvas = Canvas.createCanvas(1080, 1920);
        const dimensao = canvas.getContext("2d");

        // < Carrega a imagem de fundo >
        const modelo = await Canvas.loadImage("https://i.imgur.com/gFLtWJZ.png");

        interaction.editReply({ content: `<a:oab_carregando:1187884300264275968> **|** Gerando o seu recibo...` }).then(async () => {
            // < Desenha a imagem de fundo >
            dimensao.drawImage(modelo, 0, 0, canvas.width, canvas.height);
            
            // < Cores do texto >
            dimensao.fillStyle = '#000000';
            dimensao.strokeStyle = '#000000';
            
            // < Insere o texto na imagem >
            dimensao.font = redenizarTexto(canvas, nome, 60, "JMH Typewriter");
            dimensao.fillText(nome, 108, 470);
            
            dimensao.font = redenizarTexto(canvas, advogado, 50, "JMH Typewriter");
            dimensao.fillText(advogado, 617, 649);
            
            dimensao.font = redenizarTexto(canvas, juiz, 50, "JMH Typewriter");
            dimensao.fillText(juiz, 617, 780);
            
            dimensao.font = redenizarTexto(canvas, total, 50, "JMH Typewriter");
            dimensao.fillText(total, 617, 936);
            
            dimensao.font = redenizarTexto(canvas, assinatura, 80, "adelia");
            dimensao.fillText(assinatura, 108, 1575);
    
            dimensao.strokeRect(0, 0, canvas.width, canvas.height);
    
            // < Cria a imagem para ser enviada ao usuário >
            const recibo = new AttachmentBuilder(await canvas.encode('png'), { name: 'recibo.png' });
    
            // < Responde o comando com a imagem pronta >
            interaction.editReply({ content: `<:oab_check:1187428122988126348> **|** Seu recibo foi gerado com sucesso!`, files: [recibo] });
        })
	},
};