CREATE TABLE advertencias (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), motivo VARCHAR(255), duracao DATE, responsavel VARCHAR(255), data DATETIME);

CREATE TABLE servidores (codigo INT AUTO_INCREMENT, discord_id VARCHAR(100), passaporte INT, cargo VARCHAR(255), registro DATETIME, ferias BOOLEAN, ferias_retorno DATETIME, processos INT NOT NULL DEFAULT 0, casos INT NOT NULL DEFAULT 0, PRIMARY KEY (codigo, discord_id, passaporte));

CREATE TABLE audiencias (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), assunto MEDIUMTEXT, partes MEDIUMTEXT, testemunhas MEDIUMTEXT, data DATETIME, data_audiencia DATETIME, status VARCHAR(255), observacoes VARCHAR(255));

CREATE TABLE adocoes (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), crianca BOOLEAN, adulto BOOLEAN, adotado VARCHAR(255), mae VARCHAR(255), pai VARCHAR(255), data_adocao DATE, data_abertura DATETIME, status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE carteiras (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), cliente_nome VARCHAR(255), cliente_id INT, profissao VARCHAR(255), rg VARCHAR(255), data DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE casamentos (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), noiva VARCHAR(255), noivo VARCHAR(255), testemunhas VARCHAR(255), data_abertura DATETIME, data_casamento DATETIME, status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE casos (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), policial VARCHAR(255), reu_id INT, reu VARCHAR(255), prisao VARCHAR(255), veredito VARCHAR(255), status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id));

CREATE TABLE certidoes (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), crianca VARCHAR(255), mae VARCHAR(255), pai VARCHAR(255), data_nascimento DATE, data_abertura DATETIME, status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE divorcios (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), noiva VARCHAR(255), noivo VARCHAR(255), testemunhas VARCHAR(255), data_abertura DATETIME, status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE trocas (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), cliente_nome VARCHAR(255), cliente_id INT, novo_nome VARCHAR(255), motivo VARCHAR(255), data DATETIME, FOREIGN KEY (advogado) REFERENCES servidores(discord_id), status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));

CREATE TABLE limpezas (codigo INT PRIMARY KEY AUTO_INCREMENT, advogado VARCHAR(255), juiz VARCHAR(255), reu VARCHAR(255), reu_id INT, meses INT, orcamento INT, data DATETIME, status VARCHAR(255), observacoes VARCHAR(255), FOREIGN KEY (advogado) REFERENCES servidores(discord_id), FOREIGN KEY (juiz) REFERENCES servidores(discord_id));