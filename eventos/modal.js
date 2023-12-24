/**
 * @file Evento ativado quando um usuário requere um modal.
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

        if (!interaction.isModalSubmit()) return;

        const modal = client.modalCommands.get(interaction.customId);

        if (!modal)
        {
            await require(`../padroes/padrao_erro_modal`);
            return;
        }

        try
        {
            await modal.execute(interaction, client);
            return;
        }
        catch (err)
        {
            console.error(err);

            await interaction.reply({
                content: `${interaction.user.displayName}, este comando está com erro. Comuniquei o meu desenvolvedor.`,
                ephemeral: true
            })

            return;
        }
    },
}