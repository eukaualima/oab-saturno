/**
 * @file Evento ativado quando um usuário utiliza um comando slash.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

const { logs_erros } = require("../config.json");

module.exports =
{
    name: "interactionCreate",

    async execute (interaction)
    {
        const { client } = interaction;

        if (!interaction.isChatInputCommand()) return;

        const comando = client.slashCommands.get(interaction.commandName);

        if (!comando) return;

        try
        {
            await interaction.deferReply();
            await comando.execute(interaction, client);
        }
        catch (err)
        {
            console.log(err);

            await interaction.editReply({
                content: `### <:oab_error:1187428311014576208> Erro ao executar\n${interaction.user}, este comando está com erro.`,
                ephemeral: true
            })
        }
    },
}