/**
 * @file Evento ativado enquanto o bot fica online.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

const { ActivityType } = require("discord.js");
const pool = require('../conexao/mysql')

module.exports =
{
    name: "ready",
    once: true,
    
    execute (client)
    {
        // < Alterar o status >
        client.user.setPresence({ activities: [{ name: '🧑‍⚖️ Jurídico Saturno RP' }], type: ActivityType.Playing });
        client.user.setStatus('online');

        // < Cores para o terminal >
        let vermelho = '\x1b[31m';
        let azul = '\x1b[34m';
        let nenhuma = '\u001b[0m';
        let verde = '\x1b[32m';
        let amarelo = '\x1b[33m';
        let azul2 = '\x1b[1;34m';
        let roxo = '\x1b[0;35m';

        console.log(`${vermelho}((${roxo}Sistema${vermelho})) => ${verde}Online${nenhuma}! Logado como ${azul2}${client.user.tag}${nenhuma}.`);
        
        setInterval(() => 
        {
            pool.query(`SELECT * FROM adocoes WHERE data_audiencia <= NOW() AND lembrete != 1`, async function (erro, processo)
            {
                if (processo.length > 0)
                {
                    let id_canal = processo[0].canal;
                    
                    let canal = client.channels.cache.get(id_canal);
                    
                    canal.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\nPrezado(a) Dr(a). <@${processo[0].advogado}>, fica designada a presente **audiência de instrução e julgamento** para ter **início neste momento**, sob a presidência do(a) Meritíssimo(a) Juiz(a) de Direito, <@${processo[0].juiz}>.` })
                    
                    pool.query(`UPDATE adocoes SET lembrete = 1 WHERE codigo = ${processo[0].codigo}`)

                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Audiência encontrada, lembrete enviado.`);
                }
                else
                {
                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Nenhuma adoção marcada para agora. Próxima verificação em 2 minutos.`)
                }
            });

            pool.query(`SELECT * FROM divorcios WHERE data_audiencia <= NOW() AND lembrete != 1`, async function (erro, processo)
            {
                if (processo.length > 0)
                {
                    let id_canal = processo[0].canal;
                    
                    let canal = client.channels.cache.get(id_canal);
                    
                    canal.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\nPrezado(a) Dr(a). <@${processo[0].advogado}>, fica designada a presente **audiência de instrução e julgamento** para ter **início neste momento**, sob a presidência do(a) Meritíssimo(a) Juiz(a) de Direito, <@${processo[0].juiz}>.` })
                    
                    pool.query(`UPDATE divorcios SET lembrete = 1 WHERE codigo = ${processo[0].codigo}`)

                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Audiência encontrada, lembrete enviado.`);
                }
                else
                {
                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Nenhum divórcio marcado para agora. Próxima verificação em 2 minutos.`)
                }
            });

            pool.query(`SELECT * FROM casamentos WHERE data_casamento <= NOW() AND lembrete != 1`, async function (erro, processo)
            {
                if (processo.length > 0)
                {
                    let id_canal = processo[0].canal;
                    
                    let canal = client.channels.cache.get(id_canal);
                    
                    canal.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\nPrezado(a) Dr(a). <@${processo[0].advogado}>, fica designada a presente **audiência de instrução e julgamento** para ter **início neste momento**, sob a presidência do(a) Meritíssimo(a) Juiz(a) de Direito, <@${processo[0].juiz}>.` })
                    
                    pool.query(`UPDATE casamentos SET lembrete = 1 WHERE codigo = ${processo[0].codigo}`)

                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Audiência encontrada, lembrete enviado.`);
                }
                else
                {
                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Nenhum casamento marcado para agora. Próxima verificação em 2 minutos.`)
                }
            });

            pool.query(`SELECT * FROM audiencias WHERE data_audiencia <= NOW() AND lembrete != 1`, async function (erro, processo)
            {
                if (processo.length > 0)
                {
                    let id_canal = processo[0].canal;
                    
                    let canal = client.channels.cache.get(id_canal);
                    
                    canal.send({ content: `# <:oab_logo:1202096934093852732> Atualização do Processo\nPrezado(a) Dr(a). <@${processo[0].advogado}>, fica designada a presente **audiência de instrução e julgamento** para ter **início neste momento**, sob a presidência do(a) Meritíssimo(a) Juiz(a) de Direito, <@${processo[0].juiz}>.` })
                    
                    pool.query(`UPDATE audiencias SET lembrete = 1 WHERE codigo = ${processo[0].codigo}`)

                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Audiência encontrada, lembrete enviado.`);
                }
                else
                {
                    console.log(`${vermelho}((${roxo}Sistema${vermelho})) =>${nenhuma} Nenhuma audiência marcada para agora. Próxima verificação em 2 minutos.`)
                }
            });
        }, 120000)
    }
}