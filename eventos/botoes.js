/**
 * @file Evento ativado quando um usuário requere um botão.
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

        if (!interaction.isButton()) return;

        const botao = client.buttonCommands.get(interaction.customId);

        if (!botao)
        {
            await require("../padroes/padrao_erro_botao");
        }

        try
        {
            await botao.execute(interaction);
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