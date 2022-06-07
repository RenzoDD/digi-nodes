DELIMITER //
DROP TABLE IF EXISTS Countries // 
CREATE TABLE Countries (
	CountryID	INTEGER	NOT NULL	AUTO_INCREMENT,
	Name		TEXT	NOT NULL	UNIQUE,
	PRIMARY KEY (CountryID)
) //

DROP PROCEDURE IF EXISTS SelectCountryByName //
CREATE PROCEDURE SelectCountryByName ( IN Name TEXT )
BEGIN
	SET @id = NULL;
	SET @name = NULL;
    
	SELECT C.CountryID, C.Name INTO @id, @name
	FROM Countries AS C
	WHERE C.Name = Name;
    
    IF isnull(@id) THEN
		INSERT INTO Countries (Name)
        VALUES (Name);
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