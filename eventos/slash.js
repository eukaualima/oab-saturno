/**
 * @file Evento ativado quando um usuário utiliza um comando slash.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

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
            await comando.execute(interaction);
        }
        catch (err)
        {
            console.error(err);

            await interaction.reply({
                content: `${interaction.user.displayName}, este comando está com erro. Comuniquei o meu desenvolvedor.`,
                ephemeral: true
            })
        }
    },
}