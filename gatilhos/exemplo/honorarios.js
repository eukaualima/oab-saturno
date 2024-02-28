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
	name: ["honorários"],

	execute(message, args) {
		if (message.author.id == "513880665754828800")
		{
			message.delete();
			message.channel.send({
				content: `### <:oab_policia:1188266116770975744> Atendimento em DP
				* Honorários: R$ 100.000,00
				* **100%** do(a) advogado(a).
				\n### <:oab_reu:1187577589448060989> Limpeza de ficha
				* Honorários: Soma das penas x R$ 4.000,00
				 * Abaixo de 15 meses, cobrar o valor mínimo de R$ 50.000,00
				* Consulta de ficha limpa: R$ 50.000,00 (**100% **do(a) advogado(a))
				* Parcela do(a) Juiz(a): **50%** do valor total (Passaporte: 1282)
				\n### <:oab_noiva:1189409204834943066> Casamento
				* Honorários: R$ 1.000.000,00 (1kk)
				* Parcela do(a) Juiz(a): **R$ 750.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 250.000,00
				\n### <:oab_juiz:1187577598776193136> Audiência de Custódia
				* Honorários: R$ 250.000,00
				\n### <:oab_veredito:1187577594472837171> Divórcio/separação de bens - Audiência de Conciliação
				* Honorários: R$ 1.750.000,00
				* Parcela do(a) Juiz(a): **R$ 1.500.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 250.000,00
				\n### <:oab_crianca:1188547935579938936> Adoção - Crianças e adultos
				* Honorários: R$ 500.000,00
				* Parcela do(a) Juiz(a): **R$ 250.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 250.000,00
				\n### <:oab_escrita:1188542389179133992> Troca de nome
				* Honorários: R$ 500.000,00
				* Parcela do(a) Juiz(a): **R$ 250.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 250.000,00
				\n### <:oab_partes:1188556237911109764> Audiências
				* Honorários: R$ 500.000,00
				* Parcela do(a) Juiz(a): **R$ 250.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 250.000,00
				\n### <:oab_id:1189405031515029615> Emissão de documentos
				* Honorários: R$ 400.000,00
				* Parcela do(a) Juiz(a): **R$ 200.000,00** (Passaporte: 1282)
				* Parcela do(a) Advogado(a): R$ 200.000,00`,
			});
		}
	},
};
