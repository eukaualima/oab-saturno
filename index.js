/**
 * @file Arquivo principal do bot, responsável por gerir eventos, handlers, interações, etc.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação do FS para ler as pastas e arquivos >
const fs = require("fs");

// < Importação do Discord >
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

// < Importação das configurações padrões >
const { discord_token, client_id, guild_id } = require("./config.json");

// < Cores para o terminal >
let vermelho = '\x1b[31m';
let azul = '\x1b[34m';
let nenhuma = '\u001b[0m';
let verde = '\x1b[32m';
let amarelo = '\x1b[33m';
let azul2 = '\x1b[1;34m';
let roxo = '\x1b[0;35m';

/**
 * Declaração das intents necessárias para o funcionamento do bot e instanciamento do client Discord.
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

/**
 * Carrega os eventos handler.
 */
// < Declara a pasta e o tipo de arquivo >
const pasta_eventos = fs.readdirSync("./eventos").filter((file) => file.endsWith('js'));

// < Itera sobre a pasta carrega arquivo por arquivo >
for (const arquivo of pasta_eventos)
{
    const evento = require(`./eventos/${arquivo}`);

    if (evento.once)
    {
        client.once(evento.name, (...args) => evento.execute(...args, client));
    }
    else
    {
        client.on(evento.name, async (...args) => await evento.execute(...args, client));
    }

    console.log(`${vermelho}((${roxo}SISTEMA${vermelho})) =>${nenhuma} Evento ${amarelo}'${nenhuma}${evento.name}${amarelo}'${nenhuma} carregado com ${verde}sucesso${nenhuma}!`);
}

/**
 * Instancia todos os objetos de coleção do Discord.
 */
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.modalCommands = new Collection();
client.triggers = new Collection();

/**
 * Carrega todos os comandos slash registrados.
 */
// < Declara a pasta >
const pasta_slash = fs.readdirSync("./interacoes/slash");

// < Itera sobre a pasta e carrega comando por comando >
for (const modulo of pasta_slash)
{
    const arquivos_comandos = fs.readdirSync(`./interacoes/slash/${modulo}`).filter((file) => file.endsWith('js'));

    for (const arquivo_comando of arquivos_comandos)
    {
        const comando = require(`./interacoes/slash/${modulo}/${arquivo_comando}`);
        client.slashCommands.set(comando.data.name, comando);
    }
}

/**
 * Carrega todos os botões registrados.
 */
// < Declara a pasta >
const pasta_botoes = fs.readdirSync("./interacoes/botoes");

// < Itera sobre a pasta e carrega botão por botão >
for (const modulo of pasta_botoes)
{
    const arquivos_botoes = fs.readdirSync(`./interacoes/botoes/${modulo}`).filter((file) => file.endsWith('js'));

    for (const arquivo_botao of arquivos_botoes)
    {
        const botao = require(`./interacoes/botoes/${modulo}/${arquivo_botao}`);
        client.buttonCommands.set(botao.id, botao);
    }
}

/**
 * Carrega todos os modals registrados.
 */
// < Declara a pasta >
const pasta_modals = fs.readdirSync("./interacoes/modals");

// < Itera sobre a pasta e carrega modal por modal >
for (const modulo of pasta_modals)
{
    const arquivos_modals = fs.readdirSync(`./interacoes/modals/${modulo}`).filter((file) => file.endsWith('js'));

    for (const arquivo_modal of arquivos_modals)
    {
        const modal = require(`./interacoes/modals/${modulo}/${arquivo_modal}`);
        client.modalCommands.set(modal.id, modal);
    }
}

/**
 * Carrega todos os modals registrados.
 */
// < Declara a pasta >
const pasta_menus = fs.readdirSync("./interacoes/menus");

// < Itera sobre a pasta e carrega modal por modal >
for (const modulo of pasta_menus)
{
    const arquivos_menus = fs.readdirSync(`./interacoes/menus/${modulo}`).filter((file) => file.endsWith('js'));

    for (const arquivo_menu of arquivos_menus)
    {
        const menu = require(`./interacoes/menus/${modulo}/${arquivo_menu}`);
        client.selectCommands.set(menu.id, menu);
    }
}

/**
 * Registra o Slash na API 
*/
const rest = new REST({ version: "10" }).setToken(discord_token);

const comandos_json = [ ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()) ];

(async () => 
{
    try
    {
        console.log(`${vermelho}((${roxo}SISTEMA${vermelho})) =>${nenhuma} Atualização de comandos iniciada...`);

        await rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: comandos_json } );
        // await rest.put(Routes.applicationCommands(client_id), { body: comandos_json } );

        console.log(`${vermelho}((${roxo}SISTEMA${vermelho})) =>${nenhuma} Comandos carregados com ${verde}sucesso${nenhuma}!`);
    }
    catch(error)
    {
        console.log(error);
    }
})();

/**
 * Registra as mensagens-gatilho.
 */
const pasta_gatilhos = fs.readdirSync("./gatilhos");

for (const pasta of pasta_gatilhos)
{
    const arquivos_gatilhos = fs.readdirSync(`./gatilhos/${pasta}`).filter((file) => file.endsWith('js'));

    for (const arquivo of arquivos_gatilhos)
    {
        const gatilho = require(`./gatilhos/${pasta}/${arquivo}`);

        client.triggers.set(gatilho.name, gatilho);
    }
}

// < Inicializa o bot >
client.login(discord_token);