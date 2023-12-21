/**
 * @file Evento ativado enquanto o bot fica online.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

module.exports =
{
    name: "ready",
    once: true,
    
    execute (client)
    {
        // < Cores para o terminal >
        let vermelho = '\x1b[31m';
        let azul = '\x1b[34m';
        let nenhuma = '\u001b[0m';
        let verde = '\x1b[32m';
        let amarelo = '\x1b[33m';
        let azul2 = '\x1b[1;34m';
        let roxo = '\x1b[0;35m';

        console.log(`${vermelho}((${roxo}Sistema${vermelho})) => ${verde}Online${nenhuma}! Logado como ${azul2}${client.user.tag}${nenhuma}.`);
    }
}