/**
 * @file Botão para abertura do Modal de limpar Ficha.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, ChannelType } = require('discord.js');
const pool = require('../../../conexao/mysql');
const moment = require('moment');

const { categoria_prova, cargo_juiz, cargo_everyone, canal_vereditos, footer, cor_embed } = require('../../../config.json');
moment.locale('pt-BR');

// < Inicia o botão >
module.exports = 
{
	id: "slc_abrir_processo",

    // < Executa o código do botão >
	async execute(interaction, client) 
    {
        let resposta;
        
        // < Verifica a entrada >
        if (interaction.values[0] == "abrir_troca")
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_mudar_nome")
            .setTitle('Mudança de nome')

            // < Cria os campos >
            const nome_antigo = new TextInputBuilder()
                .setCustomId('mudar_nome_antigo')
                .setLabel("Nome antigo:")
                .setPlaceholder("Nome atual completo do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const nome_novo = new TextInputBuilder()
                .setCustomId('mudar_nome_novo')
                .setLabel("Novo nome:")
                .setPlaceholder("Nome completo que seu cliente deseja")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const passaporte = new TextInputBuilder()
                .setCustomId('mudar_nome_passaporte')
                .setLabel("Passaporte:")
                .setPlaceholder("Passaporte do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const motivo = new TextInputBuilder()
                .setCustomId('mudar_nome_motivo')
                .setLabel("Motivo:")
                .setPlaceholder("Motivo da troca de nome")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const nome_antigo_campo = new ActionRowBuilder().addComponents(nome_antigo);
            const nome_novo_campo = new ActionRowBuilder().addComponents(nome_novo);
            const passaporte_campo = new ActionRowBuilder().addComponents(passaporte);
            const motivo_campo = new ActionRowBuilder().addComponents(motivo);

            // < Adiciona os campos ao modal >
            modal.addComponents(nome_antigo_campo, nome_novo_campo, passaporte_campo, motivo_campo);
            
            // < Mostra o modal >
            await interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_reset")
        {
            const select = new StringSelectMenuBuilder()
            .setCustomId('slc_abrir_processo')
            .setPlaceholder('Selecione um processo...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Resetar escolha')
                    .setDescription('Tira a escolha selecionada anteriormente.')
                    .setEmoji('1202096934093852732')
                    .setValue('abrir_reset'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Troca de nome')
                    .setDescription('Solicite a Troca de Nome do(a) seu/sua cliente.')
                    .setEmoji('1188542389179133992')
                    .setValue('abrir_troca'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Limpeza de Ficha Criminal')
                    .setDescription('Solicite a Limpeza de Ficha Criminal do(a) seu/sua cliente.')
                    .setEmoji('1205396901575270411')
                    .setValue('abrir_limpeza'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Adoção')
                    .setDescription('Marque a audiência de Adoção do(a) seu/sua cliente.')
                    .setEmoji('1188547935579938936')
                    .setValue('abrir_adocao'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Audiência')
                    .setDescription('Marque a audiência do(a) seu/sua cliente.')
                    .setEmoji('1188556234551464026')
                    .setValue('abrir_audiencia'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Casamento')
                    .setDescription('Solicite o Casamento do(a) seu/sua cliente.')
                    .setEmoji('1189409204834943066')
                    .setValue('abrir_casamento'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Divórcio')
                    .setDescription('Solicite o Divórcio do(a) seu/sua cliente.')
                    .setEmoji('1205396904020811776')
                    .setValue('abrir_divorcio'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Carteira Profissional')
                    .setDescription('Solicite a Carteira Profissional do(a) seu/sua cliente.')
                    .setEmoji('1189405031515029615')
                    .setValue('abrir_carteira_profissional'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Certidão de Nascimento')
                    .setDescription('Solicite a Certidão de Nascimento do(a) seu/sua cliente.')
                    .setEmoji('1202100213485928528')
                    .setValue('abrir_certidao'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Carteira OAB')
                    .setDescription('Solicite a sua Carteira de Identificação OAB.')
                    .setEmoji('1188267318875271168')
                    .setValue('abrir_carteira'),
            );
    
            const row = new ActionRowBuilder().addComponents(select);

            await interaction.update({ components: [row] });
        }
        else if (interaction.values[0] == "abrir_limpeza") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_limpar_ficha")
            .setTitle('Limpeza de Fichas')

            // < Cria os campos >
            const reu_nome = new TextInputBuilder()
                .setCustomId('limpar_ficha_reu_nome')
                .setLabel("Nome do réu:")
                .setPlaceholder("Nome do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const reu_id = new TextInputBuilder()
                .setCustomId('limpar_ficha_reu_id')
                .setLabel("Passaporte do réu:")
                .setPlaceholder("Passaporte do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const meses = new TextInputBuilder()
                .setCustomId('limpar_ficha_meses')
                .setLabel("Meses totais do réu:")
                .setPlaceholder("Meses totais de prisão do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const reu_nome_campo = new ActionRowBuilder().addComponents(reu_nome);
            const reu_id_campo = new ActionRowBuilder().addComponents(reu_id);
            const meses_campo = new ActionRowBuilder().addComponents(meses);

            // < Adiciona os campos ao modal >
            modal.addComponents(reu_nome_campo, reu_id_campo, meses_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_adocao") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_adocao")
            .setTitle('Audiência de Adoção')

            // < Cria os campos >
            const crianca = new TextInputBuilder()
                .setCustomId('adocao_nome')
                .setLabel("Nome da/do criança/adulto e ID:")
                .setPlaceholder("Nome completo e passaporte da criança/adulto.")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const mae = new TextInputBuilder()
                .setCustomId('adocao_mae')
                .setLabel("Nome da mãe e ID:")
                .setPlaceholder("Nome completo e passaporte da mãe (caso tenha)")
                .setStyle(TextInputStyle.Short);
            const pai = new TextInputBuilder()
                .setCustomId('adocao_pai')
                .setLabel("Nome do/da pai/mãe e ID:")
                .setPlaceholder("Nome completo e passaporte do pai/mãe (caso tenha)")
                .setStyle(TextInputStyle.Short);
            const data = new TextInputBuilder()
                .setCustomId('adocao_data')
                .setLabel("Data da adoção:")
                .setPlaceholder("Ex.: 26 de dezembro de 2023")
                .setStyle(TextInputStyle.Short);
            
            const disponibilidade = new TextInputBuilder()
                .setCustomId('adocao_disponibilidade')
                .setLabel("Disponibilidade de horário dos pais:")
                .setPlaceholder("Ex.: A partir das 22h, quartas e quintas")
                .setStyle(TextInputStyle.Short);
            
            const crianca_campo = new ActionRowBuilder().addComponents(crianca);
            const mae_campo = new ActionRowBuilder().addComponents(mae);
            const pai_campo = new ActionRowBuilder().addComponents(pai);
            const data_campo = new ActionRowBuilder().addComponents(data);
            const disponibilidade_campo = new ActionRowBuilder().addComponents(disponibilidade);

            // < Adiciona os campos ao modal >
            modal.addComponents(crianca_campo, mae_campo, pai_campo, data_campo, disponibilidade_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_audiencia") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_audiencia")
            .setTitle('Audiência criminal/trabalhista')

            // < Cria os campos >
            const assunto = new TextInputBuilder()
                .setCustomId('audiencia_assunto')
                .setLabel("Assunto:")
                .setPlaceholder("Informe o que será tratado na audiência")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const cliente = new TextInputBuilder()
                .setCustomId('audiencia_cliente')
                .setLabel("Nome e ID do seu/sua cliente:")
                .setPlaceholder("Nome completo e passaporte do seu/sua cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const acusados = new TextInputBuilder()
                .setCustomId('audiencia_acusados')
                .setLabel("Nome e ID do(s) acusado(s):")
                .setPlaceholder("Nome completo e passaporte do(s) acusado(s)")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const testemunhas = new TextInputBuilder()
                .setCustomId('audiencia_testemunhas')
                .setLabel("Testemunhas:")
                .setPlaceholder("Nome completo e passaporte das testemunhas envolvidas (caso tenha)")
                .setStyle(TextInputStyle.Paragraph);

            const provas = new TextInputBuilder()
                .setCustomId('audiencia_provas')
                .setLabel("Há provas sobre o ocorrido?")
                .setPlaceholder("Responda com SIM ou NÃO")
                .setStyle(TextInputStyle.Short);
            
            const assunto_campo = new ActionRowBuilder().addComponents(assunto);
            const acusados_campo = new ActionRowBuilder().addComponents(acusados);
            const testemunhas_campo = new ActionRowBuilder().addComponents(testemunhas);
            const cliente_campo = new ActionRowBuilder().addComponents(cliente);
            const provas_campo = new ActionRowBuilder().addComponents(provas);

            // < Adiciona os campos ao modal >
            modal.addComponents(assunto_campo, cliente_campo, acusados_campo, testemunhas_campo, provas_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_casamento") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_casamento")
            .setTitle('Casamento')

            // < Cria os campos >
            const noiva = new TextInputBuilder()
                .setCustomId('casamento_noiva')
                .setLabel("Nome e passaporte da noiva:")
                .setPlaceholder("Nome completo e passaporte da noiva")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const noivo = new TextInputBuilder()
                .setCustomId('casamento_noivo')
                .setLabel("Nome e passaporte do noivo:")
                .setPlaceholder("Nome completo e passaporte do noivo")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const testemunhas = new TextInputBuilder()
                .setCustomId('casamento_testemunhas')
                .setLabel("Nome e passaporte das testemunhas (2 apenas):")
                .setPlaceholder("Nome completo e passaporte das testemunhas")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const data = new TextInputBuilder()
                .setCustomId('casamento_data')
                .setLabel("Data e hora do casamento:")
                .setPlaceholder("Informe a data e hora escolhida pelo seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const noiva_campo = new ActionRowBuilder().addComponents(noiva);
            const noivo_campo = new ActionRowBuilder().addComponents(noivo);
            const testemunhas_campo = new ActionRowBuilder().addComponents(testemunhas);
            const data_campo = new ActionRowBuilder().addComponents(data);

            // < Adiciona os campos ao modal >
            modal.addComponents(noiva_campo, noivo_campo, testemunhas_campo, data_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_divorcio") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_divorcio")
            .setTitle('Divórcio')

            // < Cria os campos >
            const noiva = new TextInputBuilder()
                .setCustomId('divorcio_noiva')
                .setLabel("Nome e passaporte da noiva:")
                .setPlaceholder("Nome completo e passaporte da noiva")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const noivo = new TextInputBuilder()
                .setCustomId('divorcio_noivo')
                .setLabel("Nome e passaporte do noivo:")
                .setPlaceholder("Nome completo e passaporte do noivo")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const testemunhas = new TextInputBuilder()
                .setCustomId('divorcio_testemunhas')
                .setLabel("Nome e passaporte das testemunhas (2 apenas):")
                .setPlaceholder("Nome completo e passaporte das testemunhas")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const noiva_campo = new ActionRowBuilder().addComponents(noiva);
            const noivo_campo = new ActionRowBuilder().addComponents(noivo);
            const testemunhas_campo = new ActionRowBuilder().addComponents(testemunhas);

            // < Adiciona os campos ao modal >
            modal.addComponents(noiva_campo, noivo_campo, testemunhas_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_carteira_profissional") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_carteira_profissional")
            .setTitle('Carteira Profissional')

            // < Cria os campos >
            const nome = new TextInputBuilder()
                .setCustomId('carteira_nome')
                .setLabel("Nome:")
                .setPlaceholder("Nome do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const id = new TextInputBuilder()
                .setCustomId('carteira_id')
                .setLabel("Passaporte:")
                .setPlaceholder("Passaporte do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const profissao = new TextInputBuilder()
                .setCustomId('carteira_profissao')
                .setLabel("Profissão:")
                .setPlaceholder("Profissão do seu cliente")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const rg = new TextInputBuilder()
                .setCustomId('carteira_rg')
                .setLabel("RG:")
                .setPlaceholder("Licença que pode ser vista no F11")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const nome_campo = new ActionRowBuilder().addComponents(nome);
            const id_campo = new ActionRowBuilder().addComponents(id);
            const profissao_campo = new ActionRowBuilder().addComponents(profissao);
            const rg_campo = new ActionRowBuilder().addComponents(rg);

            // < Adiciona os campos ao modal >
            modal.addComponents(nome_campo, id_campo, profissao_campo, rg_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_certidao") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_certidao")
            .setTitle('Certidão de nascimento')

            // < Cria os campos >
            const crianca = new TextInputBuilder()
                .setCustomId('certidao_crianca')
                .setLabel("Nome e passaporte da criança:")
                .setPlaceholder("Nome completo e passaporte da criança")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const mae = new TextInputBuilder()
                .setCustomId('certidao_mae')
                .setLabel("Nome e passaporte da mãe:")
                .setPlaceholder("Nome completo e passaporte da mãe")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const pai = new TextInputBuilder()
                .setCustomId('certidao_pai')
                .setLabel("Nome e passaporte do/da pai/mãe:")
                .setPlaceholder("Nome completo e passaporte do/da pai/mãe")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const data = new TextInputBuilder()
                .setCustomId('certidao_data')
                .setLabel("Data de nascimento:")
                .setPlaceholder("Data no formato ex.: 23 de janeiro de 2004")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const crianca_campo = new ActionRowBuilder().addComponents(crianca);
            const mae_campo = new ActionRowBuilder().addComponents(mae);
            const pai_campo = new ActionRowBuilder().addComponents(pai);
            const data_campo = new ActionRowBuilder().addComponents(data);

            // < Adiciona os campos ao modal >
            modal.addComponents(crianca_campo, mae_campo, pai_campo, data_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
        else if (interaction.values[0] == "abrir_carteira") 
        {
            // < Cria o modal >
            const modal = new ModalBuilder()
            .setCustomId("mdl_carteira")
            .setTitle('Solicitação de Carteira OAB')

            // < Cria os campos >
            const crianca = new TextInputBuilder()
                .setCustomId('carteira_advogado')
                .setLabel("Nome do(a) Advogado(a):")
                .setPlaceholder("Nome completo")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const mae = new TextInputBuilder()
                .setCustomId('carteira_passaporte')
                .setLabel("Passsaporte:")
                .setPlaceholder("Passaporte do(a) Advogado(a)")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const pai = new TextInputBuilder()
                .setCustomId('carteira_rg')
                .setLabel("RG:")
                .setPlaceholder("Licença que fica no F11")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const crianca_campo = new ActionRowBuilder().addComponents(crianca);
            const mae_campo = new ActionRowBuilder().addComponents(mae);
            const pai_campo = new ActionRowBuilder().addComponents(pai);

            // < Adiciona os campos ao modal >
            modal.addComponents(crianca_campo, mae_campo, pai_campo);
            
            // < Mostra o modal >
            interaction.showModal(modal);
        }
    },
};