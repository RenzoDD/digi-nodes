DELIMITER //
DROP TABLE IF EXISTS Countries // 
CREATE TABLE Countries (
	CountryID	INTEGER			NOT NULL	AUTO_INCREMENT,
	Name		VARCHAR(255)	NOT NULL	UNIQUE,
	Code		VARCHAR(15)		NOT NULL	UNIQUE,
	PRIMARY KEY (CountryID)
) //

DROP PROCEDURE IF EXISTS SelectCountryByName //
CREATE PROCEDURE SelectCountryByName ( IN Name TEXT, IN Code TEXT )
BEGIN
	SET @id = NULL;
    
	SELECT C.CountryID INTO @id
	FROM Countries AS C
	WHERE C.Name = Name AND C.Code = Code;
    
    IF isnull(@id) THEN
		INSERT INTO Countries (Name, Code)
        VALUES (Name, Code);
    END IF;
        
    SELECT C.*
	FROM Countries AS C
	WHERE C.Name = Name;
END //

DROP PROCEDURE IF EXISTS SelectCountryByID //
CREATE PROCEDURE SelectCountryByID ( IN CountryID INTEGER )
BEGIN
	SELECT C.*
	FROM Countries AS C
	WHERE C.CountryID = CountryID;
END //