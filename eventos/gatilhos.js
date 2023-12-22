/**
 * @file Evento ativado quando um usuário utiliza um gatilho.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

module.exports = 
{
    name: "messageCreate",

    async execute (message)
    {
        const args = message.content.split(/ + /);

        if (message.author.bot) return;

        let gatilhado = false;

        message.client.tiggers.every((trigger) =>
        {
            if (gatilhado) return false;

            trigger.name.every(async (name) => 
            {
                if (gatilhado) return false;

                if (message.content.includes(name))
                {
                    try
                    {
                        trigger.execute(message, args);
                    }
                    catch (error)
                    {
                        console.error(error);
                    }

                    gatilhado = true;

                    return false;
                }
            })
        })
    }
}