DELIMITER //
DROP TABLE IF EXISTS Subversions // 
CREATE TABLE Subversions (
	SubversionID	INTEGER	NOT NULL	AUTO_INCREMENT,
	Name			TEXT	NOT NULL	UNIQUE,
	PRIMARY KEY (SubversionID)
) //

DROP PROCEDURE IF EXISTS SelectSubversionByName //
CREATE PROCEDURE SelectSubversionByName ( IN Name TEXT )
BEGIN
	SET @id = NULL;
	SET @name = NULL;
    
	SELECT S.SubversionID, S.Name INTO @id, @name
	FROM Subversions AS S
	WHERE S.Name = Name;
    
    IF isnull(@id) THEN
		INSERT INTO Subversions (Name)
        VALUES (Name);
    END IF;
	
    SELECT S.*
	FROM Subversions AS S
	WHERE S.Name = Name;
END //

DROP PROCEDURE IF EXISTS SelectSubversionByID //
CREATE PROCEDURE SelectSubversionByID ( IN SubversionID INTEGER )
BEGIN
	SELECT S.*
	FROM Subversions AS S
	WHERE S.SubversionID = SubversionID;
END //