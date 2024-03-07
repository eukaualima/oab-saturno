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
	name: ["hieoabjur2id"],

	execute(message, args) {
		if (message.author.id == "513880665754828800")
		{
			message.delete();
			message.channel.send({
				content: `# <:oab_partes:1188556237911109764> FUNÇÕES & HIERARQUIA
                Segue abaixo a função detalhada de cada cargo e seus respectivos membros.
                ## <:oab_juiz:1187577598776193136> Juiz(a)
                * **Presidir audiências:** Conduzir o andamento das audiências, garantir a ordem e o cumprimento das leis processuais.
                * **Analisar e decidir sobre pedidos de:**
                 * **Limpeza de ficha criminal:** Avaliar os pedidos e decidir se a ficha do requerente deve ser limpa.
                 * **Alteração de nome:** Analisar os pedidos e decidir se a mudança de nome é procedente.
                 * **Casamentos e divórcios:** Celebrar casamentos e dissolver divórcios, seguindo os trâmites legais.
                 * **Contratação, promoção e demissão de funcionários:** Autorizar a contratação, promoção e demissão de funcionários do sistema judiciário, de acordo com as normas e procedimentos internos.
                 * **Gerenciar a equipe do tribunal:** Supervisionar o trabalho dos servidores e zelar pelo bom funcionamento do tribunal.
                * **Juízes:**
                ## <:oab_adv:1188267318875271168> Promotor(a):
                * **Representar o Ministério Público:** Atuar em defesa da sociedade e dos interesses públicos.
                * **Defensoria Pública:**
                 *** Atender e defender pessoas necessitadas:** Assegurar o acesso à justiça para pessoas que não podem arcar com os custos de um advogado particular.
                 * **Representar os clientes em audiências e processos:** Defender os interesses dos seus clientes em todas as etapas do processo judicial.
                *** Gerenciar o pessoal do tribunal:** treinar e desenvolver os servidores do sistema judiciário.
                * **Solicitações permitidas:** todas.
                * **Promotores:**
                ## <:oab_adv:1188267318875271168> Advogado(a)
                * **Representar seus clientes em audiências e processos:** Defender os interesses dos seus clientes em todas as etapas do processo judicial.
                * **Negociar acordos: **Buscar soluções amigáveis para os conflitos dos seus clientes.
                * **Solicitações permitidas:** todas.
                * **Advogados:**
                ## <:oab_adv:1188267318875271168> Estagiário(a)
                * **Acompanhar os advogados na defensoria dos clientes presos: **Observar a atuação dos advogados e aprender sobre o sistema judiciário.
                * **Solicitações permitidas:** limpezas de ficha criminal.
                * **Estagiários:**`,
			});
		}
	},
};
