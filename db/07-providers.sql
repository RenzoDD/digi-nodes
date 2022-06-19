DELIMITER //
DROP TABLE IF EXISTS Providers // 
CREATE TABLE Providers (
	ProviderID  INTEGER	NOT NULL	AUTO_INCREMENT,
	Name	    TEXT	NOT NULL	UNIQUE,
	PRIMARY KEY (ProviderID)
) //

DROP PROCEDURE IF EXISTS SelectProviderByName //
CREATE PROCEDURE SelectProviderByName ( IN Name TEXT )
BEGIN
	SET @id = NULL;
    
	SELECT P.ProviderID INTO @id
	FROM Providers AS P
	WHERE P.Name = Name;
    
    IF isnull(@id) THEN
		INSERT INTO Providers (Name)
        VALUES (Name);
    END IF;
	
    SELECT P.*
	FROM Providers AS P
	WHERE P.Name = Name;
END //

DROP PROCEDURE IF EXISTS SelectProviderByID //
CREATE PROCEDURE SelectProviderByID ( IN ProviderID INTEGER )
BEGIN
	SELECT P.*
	FROM Providers AS P
	WHERE P.ProviderID = ProviderID;
END //