drop database chat_app;
CREATE DATABASE chat_app;
USE chat_app;


CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(254) NOT NULL,
  pass VARCHAR(60) default null,
  googleId VARCHAR(255) default null unique,
  email VARCHAR(254) NOT NULL unique,
  avatar VARCHAR(255), -- <--- AGREGADO
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId int not null,
  contactoId int not null,
  alias varchar(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contactoId) REFERENCES users(id) ON DELETE CASCADE,
  unique(userId,contactoId)
);

CREATE TABLE chats (
  id INT AUTO_INCREMENT primary key,
  user1Id INT NOT NULL,
  user2Id INT NOT NULL,
  user1ClavaVisto tinyint default 0,
  user2ClavaVisto tinyint default 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (user1Id, user2Id),
  FOREIGN KEY (user1Id) REFERENCES users(id),
  FOREIGN KEY (user2Id) REFERENCES users(id),
  CONSTRAINT chk_order CHECK (user1Id <= user2Id)-- no se puede agregar a la tabla un user1Id mayor a user2Id  
);

CREATE TABLE Mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chatId INT NOT NULL,
  emisorId int not null,
  contenido TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (emisorId) REFERENCES users(id),
  FOREIGN KEY (chatId) REFERENCES chats(id)
  
);



-- función que mide la distancia entre dos palabras (cuántos cambios hay que hacer para pasar de una a otra).

DELIMITER $$

CREATE FUNCTION levenshtein(s1 TEXT, s2 TEXT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE s1_len, s2_len, i, j, c, c_temp, cost INT;
  DECLARE s1_char CHAR;
  DECLARE cv0, cv1 TEXT;

  SET s1_len = LENGTH(s1);
  SET s2_len = LENGTH(s2);

  IF s1_len = 0 THEN
    RETURN s2_len;
  END IF;
  IF s2_len = 0 THEN
    RETURN s1_len;
  END IF;

  SET cv1 = REPEAT(CHAR(0), s2_len + 1);
  SET j = 0;
  WHILE j <= s2_len DO
    SET cv1 = INSERT(cv1, j + 1, 1, CHAR(j));
    SET j = j + 1;
  END WHILE;

  SET i = 1;
  WHILE i <= s1_len DO
    SET cv0 = INSERT(cv1, 1, 1, CHAR(i));
    SET s1_char = SUBSTRING(s1, i, 1);
    SET j = 1;
    WHILE j <= s2_len DO
      SET cost = IF(s1_char = SUBSTRING(s2, j, 1), 0, 1);
      SET c = ORD(SUBSTRING(cv1, j + 1, 1)) + 1;
      SET c_temp = ORD(SUBSTRING(cv0, j, 1)) + 1;
      IF c_temp < c THEN
        SET c = c_temp;
      END IF;
      SET c_temp = ORD(SUBSTRING(cv1, j, 1)) + cost;
      IF c_temp < c THEN
        SET c = c_temp;
      END IF;
      SET cv0 = INSERT(cv0, j + 1, 1, CHAR(c));
      SET j = j + 1;
    END WHILE;
    SET cv1 = cv0;
    SET i = i + 1;
  END WHILE;

  RETURN ORD(SUBSTRING(cv1, s2_len + 1, 1));
END $$

DELIMITER ;