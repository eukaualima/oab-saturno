/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');
const { cargo_juiz, cargo_everyone, categoria_trocas, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "mdl_processo_advogado",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        // < Permissões dos canais >
        const { ViewChannel, SendMessages, AttachFiles } = PermissionFlagsBits;

        // < Coleta as informações passadas no modal >
        const advogado_novo = interaction.fields.getTextInputValue('advogado_novo');
        let natureza = interaction.fields.getTextInputValue('natureza_processo');
        const codigo = interaction.fields.getTextInputValue('codigo_processo');

        if (natureza == "Certidão")
        {
            natureza = "certidoes";
        }
        else if (natureza == "Adoção")
        {
            natureza = "adocoes";
        }
        else if (natureza == "Audiência")
        {
            natureza = "audiencias";
        }
        else if (natureza == "Divórcio")
        {
            natureza = "divorcios";
        }
        else
        {
            natureza = natureza.toLowerCase() + 's';
        }

        await interaction.reply({ content: `## <a:oab_carregando:1187884300264275968> Aguarde...\nEstou adicionando o(a) novo(a) advogado(a) ao processo!` });

        pool.query(`SELECT * FROM servidores WHERE passaporte = '${advogado_novo}'`, async function (erro, servidores)
        {
            if (servidores.length == 0)
            {
                return interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** O passaporte informado não faz parte do jurídico.`, ephemeral: true })
            }
            else
            {
                let advogado_user = await interaction.guild.members.fetch(servidores[0].discord_id);
                
                pool.query(`UPDATE ${natureza} SET advogado = '${advogado_user.id}' WHERE codigo = ${codigo}`);
    
                await interaction.channel.permissionOverwrites.edit(advogado_user, { ViewChannel: true, SendMessages: true, AttachFiles: true });
    
                return interaction.editReply({ content: `## <:oab_logo:1202096934093852732> Atualização do Processo\nAgora ${advogado_user} é o(a) novo(a) advogado(a) do caso.\n* Troca realizada pelo(a) Exmo(a). Dr(a). ${interaction.user}.` });
            }
            
        });
    },
};