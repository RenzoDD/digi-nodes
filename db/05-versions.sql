DELIMITER //
DROP TABLE IF EXISTS Versions // 
CREATE TABLE Versions (
	VersionID	INTEGER	NOT NULL	AUTO_INCREMENT,
	Number		INTEGER	NOT NULL	UNIQUE,
	PRIMARY KEY (VersionID)
) //

DROP PROCEDURE IF EXISTS SelectVersionByNumber //
CREATE PROCEDURE SelectVersionByNumber ( IN Number INTEGER )
BEGIN
	SET @id = NULL;
	SET @number = NULL;
    
	SELECT V.VersionID, V.Number INTO @id, @number
	FROM Versions AS V
	WHERE V.Number = Number;
    
    IF isnull(@id) THEN
		INSERT INTO Versions (Number)
        VALUES (Number);
    END IF;

	SELECT V.*
	FROM Versions AS V
	WHERE V.Number = Number;
END //

DROP PROCEDURE IF EXISTS SelectVersionByID //
CREATE PROCEDURE SelectVersionByID ( IN VersionID INTEGER )
BEGIN
	SELECT V.*
	FROM Versions AS V
	WHERE V.VersionID = VersionID;
END //