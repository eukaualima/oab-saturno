CREATE TABLE IF NOT EXISTS oab_saturno;

USE oab_saturno;

CREATE TABLE advertencias (codigo INT PRIMARY KEY AUTO_INCREMENT, motivo VARCHAR(255), duracao DATE, responsavel VARCHAR(255), data DATETIME);

CREATE TABLE servidores (codigo INT AUTO_INCREMENT, discord_id VARCHAR(100), passaporte INT, cargo VARCHAR(255), registro DATETIME, ferias BOOLEAN, ferias_retorno DATETIME, codadv INT, PRIMARY KEY (codigo, discord_id, passaporte), FOREIGN KEY (codadv) REFERENCES advertencias(codigo));

CREATE TABLE audiencias (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), assunto MEDIUMTEXT, partes MEDIUMTEXT, testemunhas MEDIUMTEXT, data DATETIME, data_audiencia DATETIME);

CREATE TABLE adocoes (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), crianca BOOLEAN, adulto BOOLEAN, adotado_nome VARCHAR(255), mae_nome VARCHAR(255), pai_nome VARCHAR(255), adotado_id INT, mae_id INT, pai_id INT, data_adocao DATE, data_abertura DATETIME, data_audiencia DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE carteiras (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), cliente_nome VARCHAR(255), cliente_id INT, profissao VARCHAR(255), rg VARCHAR(255), data DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE casamentos (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), noiva_nome VARCHAR(255), noivo_nome VARCHAR(255), testemunha1_nome VARCHAR(255), testemunha2_nome VARCHAR(255), noiva_id INT, noivo_id INT, testemunha1_id INT, testemunha2_id INT, data_abertura DATETIME, data_casamento DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE casos (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), policial VARCHAR(255), reu_id INT, reu VARCHAR(255), prisao VARCHAR(255), veredito VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id));

CREATE TABLE certidoes (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), crianca_nome VARCHAR(255), mae_nome VARCHAR(255), pai_nome VARCHAR(255), crianca_id INT, mae_id INT, pai_id INT, data_nascimento DATE, data_abertura DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE divorcios (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), noiva_nome VARCHAR(255), noivo_nome VARCHAR(255), testemunha1_nome VARCHAR(255), testemunha2_nome VARCHAR(255), noiva_id INT, noivo_id INT, testemunha1_id INT, testemunha2_id INT, data_abertura DATETIME, data_casamento DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE limpezas (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), reu VARCHAR(255), reu_id INT, meses INT, orcamento INT, data DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));