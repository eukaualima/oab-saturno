/**
 * @file Evento ativado quando um usuário requere um menu.
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

        if (!interaction.isAnySelectMenu()) return;

        const menu = client.selectCommands.get(interaction.customId);

        if (!menu)
        {
            await require("../padroes/padrao_erro_menu");
        }

        try
        {
            await menu.execute(interaction);
        }
        catch (err)
        {
            console.error(err);

            await interaction.editReply({
                content: `${interaction.user.displayName}, este comando está com erro. Comuniquei o meu desenvolvedor.`,
                ephemeral: true
            })
        }
    },
}