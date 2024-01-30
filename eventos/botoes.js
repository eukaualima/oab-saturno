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
        
        // < Cria o filtro do botão >
        const [botao_nome, id_autor] = interaction.customId.split('-');
        
        const botao = client.buttonCommands.get(botao_nome);

        if (!botao)
        {
            await require("../padroes/padrao_erro_botao");
        }

        try
        {
            // < Verifica se foi o mesmo usuário que criou a mensagem >
            if (interaction.user.id != id_autor)
            {
                return;
            }

            // < Roda o botão >
            await botao.execute(interaction, client);
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