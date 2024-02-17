/**
 * @file Descrição do arquivo.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pool = require('../../../conexao/mysql.js');
const moment = require('moment');
const { footer, casos_dp, cor_embed, cargo_advogado, cargo_estagiario, cargo_juiz, cargo_promotor } = require("../../../config.json");

moment.locale('pt-BR');

// < Inicia o comando >
module.exports = 
{
    // < Definições do slash >
	data: new SlashCommandBuilder()
    .setName("cliente")
    .setDescription("Veja os dados de qualquer cliente/família já registrado/a em nossa base de dados.")
    .addStringOption(option =>
        option
        .setName("processo")
        .setDescription("Qual tipo de processo você quer ver?")
        .addChoices(
            { name: `Adoção`, value: `ver_adocoes` },
            { name: `Audiência`, value: `ver_audiencias` },
            { name: `Carteira Profissionai`, value: `ver_carteiras` },
            { name: `Casamento`, value: `ver_casamentos` },
            { name: `Certidão`, value: `ver_certidoes` },
            { name: `Divórcio`, value: `ver_divorcios` },
            { name: `Limpeza de Ficha Criminal`, value: `ver_limpezas` },
            { name: `Troca de Nome`, value: `ver_trocas` },
        )
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("nome")
        .setDescription("Qual é o nome ou sobrenome que deseja pesquisar?")
        .setMinLength(3)
    )
    .addIntegerOption(option =>
        option
        .setName("passaporte")
        .setDescription("Qual é o passaporte que deseja pesquisar?")
        .setMinValue(1)
    ),

    // < Executa o comando >
	async execute(interaction, client) 
    {
        const nome = "%" + interaction.options.getString("nome") + "%";
        const passaporte = interaction.options.getInteger("passaporte");
        const processo = interaction.options.getString("processo");

        let mensagem = "";

        if (nome && passaporte)
        {
            if (processo == "ver_adocoes")
            {
                pool.query(`SELECT * FROM adocoes WHERE (mae LIKE ? OR pai LIKE ? OR adotado LIKE ?)`, [nome, nome, nome], async function (erro, adocoes)
                {
                    if (adocoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < adocoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${adocoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_crianca:1188547935579938936> ${adocoes[i].adotado}\n* Mãe: ${adocoes[i].mae}\n* Pai: ${adocoes[i].pai}\n* Data de abertura: ${moment(adocoes[i].data_abertura).format('LL')}\n* Status: ${adocoes[i].status}\n* Observações: ${adocoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_audiencias")
            {
                pool.query(`SELECT * FROM audiencias WHERE (partes LIKE ? OR testemunhas LIKE ?)`, [nome, nome], async function (erro, audiencias)
                {
                    if (audiencias.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < audiencias.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${audiencias.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_partes:1188556237911109764> ${audiencias[i].assunto}\n* Partes: ${audiencias[i].partes}\n* Testemunhas: ${audiencias[i].testemunhas}\n* Data de abertura: ${moment(audiencias[i].data).format('LL')}\n* Status: ${audiencias[i].status}\n* Observações: ${audiencias[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_carteiras")
            {
                pool.query(`SELECT * FROM carteiras WHERE (cliente_nome LIKE ? AND cliente_id LIKE ?)`, [nome, passaporte], async function (erro, carteiras)
                {
                    if (carteiras.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < carteiras.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${carteiras.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_id:1189405031515029615> ${carteiras[i].cliente_nome} (Passaporte: ${carteiras[i].cliente_id})\n* Profissão: ${carteiras[i].profissao}\n* RG: ${carteiras[i].rg}\n* Data de abertura: ${moment(carteiras[i].data).format('LL')}\n* Status: ${carteiras[i].status}\n* Observações: ${carteiras[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_casamentos")
            {
                pool.query(`SELECT * FROM casamentos WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [nome, nome, nome], async function (erro, casamentos)
                {
                    if (casamentos.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < casamentos.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${casamentos.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_noiva:1189409204834943066> ${casamentos[i].noiva} & ${casamentos[i].noivo}\n* Testemunhas: ${casamentos[i].testemunhas}\n* Data de abertura: ${moment(casamentos[i].data).format('LL')}\n* Status: ${casamentos[i].status}\n* Observações: ${casamentos[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_certidoes")
            {
                pool.query(`SELECT * FROM certidoes WHERE (crianca LIKE ? OR mae LIKE ? OR pai LIKE ?)`, [nome, nome, nome], async function (erro, certidoes)
                {
                    if (certidoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < certidoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${certidoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_documento:1202100213485928528> ${certidoes[i].crianca}\n* Mãe: ${certidoes[i].mae}\n* Pai: ${certidoes[i].pai}\n* Data de abertura: ${moment(certidoes[i].data).format('LL')}\n* Status: ${certidoes[i].status}\n* Observações: ${certidoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_divorcios")
            {
                pool.query(`SELECT * FROM divorcios WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [nome, nome, nome], async function (erro, divorcios)
                {
                    if (divorcios.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < divorcios.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${divorcios.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_divorcio:1205396904020811776> ${divorcios[i].noiva} & ${divorcios[0].noivo}\n* Testemunhas: ${divorcios[i].testemunhas}\n* Data de abertura: ${moment(divorcios[i].data).format('LL')}\n* Status: ${divorcios[i].status}\n* Observações: ${divorcios[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_limpezas")
            {
                pool.query(`SELECT * FROM limpezas WHERE (reu LIKE ? AND reu_id LIKE ?)`, [nome, passaporte], async function (erro, limpezas)
                {
                    if (limpezas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < limpezas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${limpezas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_limpeza:1205396901575270411> ${limpezas[i].reu} (Passaporte: ${limpezas[i].reu_id})\n* Meses: ${limpezas[i].meses}\n* Orçamento: R$ ${(limpezas[i].orcamento).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(limpezas[i].data).format('LL')}\n* Status: ${limpezas[i].status}\n* Observações: ${limpezas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_trocas")
            {
                pool.query(`SELECT * FROM trocas WHERE (cliente_nome LIKE ? AND cliente_id LIKE ?)`, [nome, passaporte], async function (erro, trocas)
                {
                    if (trocas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < trocas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${trocas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_editar:1205643996806910064> ${trocas[i].cliente_nome} (Passaporte: ${trocas[i].cliente_id})\n* Novo nome: ${trocas[i].novo_nome}\n* Motivo: ${(trocas[i].motivo).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(trocas[i].data).format('LL')}\n* Status: ${trocas[i].status}\n* Observações: ${trocas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
        }
        else if (nome)
        {
            if (processo == "ver_adocoes")
            {
                pool.query(`SELECT * FROM adocoes WHERE (mae LIKE ? OR pai LIKE ? OR adotado LIKE ?)`, [nome, nome, nome], async function (erro, adocoes)
                {
                    if (adocoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < adocoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${adocoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_crianca:1188547935579938936> ${adocoes[i].adotado}\n* Mãe: ${adocoes[i].mae}\n* Pai: ${adocoes[i].pai}\n* Data de abertura: ${moment(adocoes[i].data_abertura).format('LL')}\n* Status: ${adocoes[i].status}\n* Observações: ${adocoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_audiencias")
            {
                pool.query(`SELECT * FROM audiencias WHERE (partes LIKE ? OR testemunhas LIKE ?)`, [nome, nome], async function (erro, audiencias)
                {
                    if (audiencias.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < audiencias.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${audiencias.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_partes:1188556237911109764> ${audiencias[i].assunto}\n* Partes: ${audiencias[i].partes}\n* Testemunhas: ${audiencias[i].testemunhas}\n* Data de abertura: ${moment(audiencias[i].data).format('LL')}\n* Status: ${audiencias[i].status}\n* Observações: ${audiencias[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_carteiras")
            {
                pool.query(`SELECT * FROM carteiras WHERE (cliente_nome LIKE ?)`, [nome], async function (erro, carteiras)
                {
                    if (carteiras.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < carteiras.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${carteiras.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_id:1189405031515029615> ${carteiras[i].cliente_nome} (Passaporte: ${carteiras[i].cliente_id})\n* Profissão: ${carteiras[i].profissao}\n* RG: ${carteiras[i].rg}\n* Data de abertura: ${moment(carteiras[i].data).format('LL')}\n* Status: ${carteiras[i].status}\n* Observações: ${carteiras[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_casamentos")
            {
                pool.query(`SELECT * FROM casamentos WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [nome, nome, nome], async function (erro, casamentos)
                {
                    if (casamentos.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < casamentos.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${casamentos.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_noiva:1189409204834943066> ${casamentos[i].noiva} & ${casamentos[i].noivo}\n* Testemunhas: ${casamentos[i].testemunhas}\n* Data de abertura: ${moment(casamentos[i].data).format('LL')}\n* Status: ${casamentos[i].status}\n* Observações: ${casamentos[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_certidoes")
            {
                pool.query(`SELECT * FROM certidoes WHERE (crianca LIKE ? OR mae LIKE ? OR pai LIKE ?)`, [nome, nome, nome], async function (erro, certidoes)
                {
                    if (certidoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < certidoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${certidoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_documento:1202100213485928528> ${certidoes[i].crianca}\n* Mãe: ${certidoes[i].mae}\n* Pai: ${certidoes[i].pai}\n* Data de abertura: ${moment(certidoes[i].data).format('LL')}\n* Status: ${certidoes[i].status}\n* Observações: ${certidoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_divorcios")
            {
                pool.query(`SELECT * FROM divorcios WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [nome, nome, nome], async function (erro, divorcios)
                {
                    if (divorcios.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < divorcios.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${divorcios.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_divorcio:1205396904020811776> ${divorcios[i].noiva} & ${divorcios[0].noivo}\n* Testemunhas: ${divorcios[i].testemunhas}\n* Data de abertura: ${moment(divorcios[i].data).format('LL')}\n* Status: ${divorcios[i].status}\n* Observações: ${divorcios[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_limpezas")
            {
                pool.query(`SELECT * FROM limpezas WHERE (reu LIKE ?)`, [nome], async function (erro, limpezas)
                {
                    if (limpezas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < limpezas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${limpezas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_limpeza:1205396901575270411> ${limpezas[i].reu} (Passaporte: ${limpezas[i].reu_id})\n* Meses: ${limpezas[i].meses}\n* Orçamento: R$ ${(limpezas[i].orcamento).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(limpezas[i].data).format('LL')}\n* Status: ${limpezas[i].status}\n* Observações: ${limpezas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_trocas")
            {
                pool.query(`SELECT * FROM trocas WHERE (cliente_nome LIKE ?)`, [nome], async function (erro, trocas)
                {
                    if (trocas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < trocas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${trocas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_editar:1205643996806910064> ${trocas[i].cliente_nome} (Passaporte: ${trocas[i].cliente_id})\n* Novo nome: ${trocas[i].novo_nome}\n* Motivo: ${(trocas[i].motivo).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(trocas[i].data).format('LL')}\n* Status: ${trocas[i].status}\n* Observações: ${trocas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
        }
        else if (passaporte)
        {
            if (processo == "ver_adocoes")
            {
                pool.query(`SELECT * FROM adocoes WHERE (mae LIKE ? OR pai LIKE ? OR adotado LIKE ?)`, [passaporte, passaporte, passaporte], async function (erro, adocoes)
                {
                    if (adocoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < adocoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${adocoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_crianca:1188547935579938936> ${adocoes[i].adotado}\n* Mãe: ${adocoes[i].mae}\n* Pai: ${adocoes[i].pai}\n* Data de abertura: ${moment(adocoes[i].data_abertura).format('LL')}\n* Status: ${adocoes[i].status}\n* Observações: ${adocoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_audiencias")
            {
                pool.query(`SELECT * FROM audiencias WHERE (partes LIKE ? OR testemunhas LIKE ?)`, [passaporte, passaporte], async function (erro, audiencias)
                {
                    if (audiencias.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < audiencias.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${audiencias.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_partes:1188556237911109764> ${audiencias[i].assunto}\n* Partes: ${audiencias[i].partes}\n* Testemunhas: ${audiencias[i].testemunhas}\n* Data de abertura: ${moment(audiencias[i].data).format('LL')}\n* Status: ${audiencias[i].status}\n* Observações: ${audiencias[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_carteiras")
            {
                pool.query(`SELECT * FROM carteiras WHERE (cliente_id LIKE ?)`, [passaporte], async function (erro, carteiras)
                {
                    if (carteiras.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < carteiras.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${carteiras.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_id:1189405031515029615> ${carteiras[i].cliente_nome} (Passaporte: ${carteiras[i].cliente_id})\n* Profissão: ${carteiras[i].profissao}\n* RG: ${carteiras[i].rg}\n* Data de abertura: ${moment(carteiras[i].data).format('LL')}\n* Status: ${carteiras[i].status}\n* Observações: ${carteiras[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_casamentos")
            {
                pool.query(`SELECT * FROM casamentos WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [passaporte, passaporte, passaporte], async function (erro, casamentos)
                {
                    if (casamentos.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < casamentos.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${casamentos.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_noiva:1189409204834943066> ${casamentos[i].noiva} & ${casamentos[i].noivo}\n* Testemunhas: ${casamentos[i].testemunhas}\n* Data de abertura: ${moment(casamentos[i].data).format('LL')}\n* Status: ${casamentos[i].status}\n* Observações: ${casamentos[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_certidoes")
            {
                pool.query(`SELECT * FROM certidoes WHERE (crianca LIKE ? OR mae LIKE ? OR pai LIKE ?)`, [passaporte, passaporte, passaporte], async function (erro, certidoes)
                {
                    if (certidoes.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < certidoes.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${certidoes.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_documento:1202100213485928528> ${certidoes[i].crianca}\n* Mãe: ${certidoes[i].mae}\n* Pai: ${certidoes[i].pai}\n* Data de abertura: ${moment(certidoes[i].data).format('LL')}\n* Status: ${certidoes[i].status}\n* Observações: ${certidoes[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_divorcios")
            {
                pool.query(`SELECT * FROM divorcios WHERE (noiva LIKE ? OR noivo LIKE ? OR testemunhas LIKE ?)`, [passaporte, passaporte, passaporte], async function (erro, divorcios)
                {
                    if (divorcios.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < divorcios.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${divorcios.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_divorcio:1205396904020811776> ${divorcios[i].noiva} & ${divorcios[0].noivo}\n* Testemunhas: ${divorcios[i].testemunhas}\n* Data de abertura: ${moment(divorcios[i].data).format('LL')}\n* Status: ${divorcios[i].status}\n* Observações: ${divorcios[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_limpezas")
            {
                pool.query(`SELECT * FROM limpezas WHERE (reu_id LIKE ?)`, [passaporte], async function (erro, limpezas)
                {
                    if (limpezas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < limpezas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${limpezas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_limpeza:1205396901575270411> ${limpezas[i].reu} (Passaporte: ${limpezas[i].reu_id})\n* Meses: ${limpezas[i].meses}\n* Orçamento: R$ ${(limpezas[i].orcamento).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(limpezas[i].data).format('LL')}\n* Status: ${limpezas[i].status}\n* Observações: ${limpezas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
            else if (processo == "ver_trocas")
            {
                pool.query(`SELECT * FROM trocas WHERE (cliente_id LIKE ?)`, [passaporte], async function (erro, trocas)
                {
                    if (trocas.length == 0)
                    {
                        return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Cliente ou família **não encontrado(a)** na base de dados.` })
                    }
                    else
                    {
                        for (let i = 0; i < trocas.length; i++)
                        {
                            if (i == 0)
                            {
                                mensagem += `## <:oab_livro:1204999345544372264> ${trocas.length.toLocaleString('pt-BR')} processo(s) encontrados:\n`;
                            }
                            mensagem += `### <:oab_editar:1205643996806910064> ${trocas[i].cliente_nome} (Passaporte: ${trocas[i].cliente_id})\n* Novo nome: ${trocas[i].novo_nome}\n* Motivo: ${(trocas[i].motivo).toLocaleString('pt-BR')}\n* Data de abertura: ${moment(trocas[i].data).format('LL')}\n* Status: ${trocas[i].status}\n* Observações: ${trocas[i].observacoes}.\n`;
                        }

                        return await interaction.editReply({ content: `${mensagem}` });
                    }
                })
            }
        }
        else
        {
            return await interaction.editReply({ content: `<:oab_error:1187428311014576208> **|** Você deve fornecer o **nome** e/ou **passaporte** do cliente, para que a pesquisa seja bem sucedida.` })
        }
	},
};
