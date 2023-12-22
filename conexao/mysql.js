/**
 * @file Criação da conexão MySQL.
 * @author Kauã Lima
 * @since OABSRP-0.1
 * @version OABSRP-0.1
 */

// < Importação das bibliotecas necessárias >
const mysql = require('mysql');

// < Arquivo de configurações do sql >
const config = require('./conexao.json');

// < Cria a conexão com o banco de dados >
const pool = mysql.createPool({
    host: config.host_name,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password
})

module.exports = pool;