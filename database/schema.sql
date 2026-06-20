
CREATE DATABASE IF NOT EXISTS jogo_bicho CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jogo_bicho;


CREATE TABLE IF NOT EXISTS usuarios (
  id         INT NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha      VARCHAR(255) NOT NULL,
  saldo      DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
  is_admin   TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sorteios (
  id        INT NOT NULL AUTO_INCREMENT,
  premio_1  VARCHAR(4) NOT NULL,
  premio_2  VARCHAR(4) NOT NULL,
  premio_3  VARCHAR(4) NOT NULL,
  premio_4  VARCHAR(4) NOT NULL,
  premio_5  VARCHAR(4) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS apostas (
  id          INT NOT NULL AUTO_INCREMENT,
  user_id     INT NOT NULL,
  tipo_aposta ENUM('grupo', 'dezena', 'milhar') NOT NULL,
  valor       DECIMAL(10,2) NOT NULL,
  animal      INT NULL,           
  dezena      VARCHAR(2)  NULL,   
  milhar      VARCHAR(4)  NULL,  
  status      ENUM('pendente', 'processada') NOT NULL DEFAULT 'pendente',
  sorteio_id  INT NULL,
  resultado   VARCHAR(10) NULL,  
  valor_ganho DECIMAL(10,2) NULL DEFAULT 0.00,
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_apostas_usuario
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_apostas_sorteio
    FOREIGN KEY (sorteio_id) REFERENCES sorteios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);


INSERT INTO usuarios (nome, email, senha, saldo, is_admin) VALUES (
  'Admin',
  'admin@bichofull.com',
  '$2b$10$wEMgRLDuMX0os.QBLMGireGM7VXNLxs4hpbWDM3/EHqnQSC95Uf7y',
  0.00,
  1
);