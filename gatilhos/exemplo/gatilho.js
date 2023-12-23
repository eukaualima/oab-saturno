/**
 * @file Gatilhos de chat, onde o bot pode responder, reagir ou qualquer outra coisa, basta ter criatividade.
 * @author Kauã Lima
 * @since Beta_Penguin-27.05.2023
 * @version Beta_Penguin-27.05.2023
 **/

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	name: ["mave"],

	execute(message, args) {
		// Put all your trigger code over here. This code will be executed when any of the element in the "name" array is found in the message content.

		message.channel.send({
			content: "Ele é muito lindo :P",
		});
	},
};
