ALTER TABLE usuarios (ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL,
ADD COLUMN senha VARCHAR(255) NOT NULL);
;