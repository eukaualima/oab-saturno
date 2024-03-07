/**
 * @file Gatilhos de chat, onde o bot pode responder, reagir ou qualquer outra coisa, basta ter criatividade.
 * @author Kauã Lima
 * @since Beta_Penguin-27.05.2023
 * @version Beta_Penguin-27.05.2023
 **/

/**
 * @type {import('../../typings').TriggerCommand}
 */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: ["hiejudoab23"],

	execute(message, args) {
		if (message.author.id == "513880665754828800")
		{
			message.delete();
			// message.channel.send({
			// 	content: `# <:oab_partes:1188556237911109764> FUNÇÕES & HIERARQUIA
			// 	\nSegue abaixo a função detalhada de cada cargo e seus respectivos membros.
            //     \n## <:oab_juiz:1187577598776193136> Juiz(a)
            //     \n* **Funções:** Presidir audiências, efetuar limpeza de ficha criminal, alterar nomes, fazer casamentos e presidir audiências de divórcios, contratar, promover e demitir funcionários.
            //     \n* **Juízes:** <@764912250250854420> <@513880665754828800>
            //     \n## <:oab_adv:1188267318875271168> Promotor(a):
            //     \n* **Função:** Defensoria pública
			// 	\n* **Pode solicitar:** Audiências, limpezas de ficha criminal, casamentos, divórcios, certidões, carteiras profissionais. 
            //     \n* **Recursos Humanos:** treinamento dos funcionários e fiscalização.
			// 	\n* **Promotores:** Ninguém
			// 	\n## <:oab_adv:1188267318875271168> Advogado(a)
            //     \n* **Função:** Defensoria pública
			// 	\n* **Pode solicitar:** Audiências, limpezas de ficha criminal, casamentos, divórcios, certidões, carteiras profissionais.
            //     \n* **Advogados:** <@1073392006283395082>
            //     \n## <:oab_adv:1188267318875271168> Estagiário(a)
            //     \n* **Função:** Acompanhar os advogados na defensoria dos clientes presos para adquirir experiência.
			// 	\n* **Pode solicitar:** limpezas de ficha criminal (acompanhado de um Advogado).
            //     \n* **Estagiários:** <@675120138139336724> <@1108468935063519334> <@791818080812531744> <@1131723420858581082> <@1024792419822219325> <@1147976791487684608>`,
			// });

			const btn_processo_advogado = new ButtonBuilder()
			.setCustomId('btn_processo_advogado')
			.setLabel(`Alterar advogado(a)`)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(`1215170641863512074`);

			const botao = new ActionRowBuilder().addComponents(btn_processo_advogado);

			message.channel.send({ content: `## <:oab_logo:1202096934093852732> Atualizar advogado(a)\nClique no botão abaixo para **alterar o(a) advogado(a)** do caso.`, components: [botao] })
		}
	},
};
