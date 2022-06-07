DELIMITER //
DROP TABLE IF EXISTS Nodes // 
CREATE TABLE Nodes (
	NodeID			INTEGER			NOT NULL	AUTO_INCREMENT,
	StateID			INTEGER 		NOT NULL	DEFAULT 1,
	CountryID		INTEGER,
	VersionID		INTEGER,
	SubversionID	INTEGER,
	IP				TEXT			NOT NULL,
	Port			INTEGER			NOT NULL,
	Longitude		DECIMAL(9,6),
	Latitude		DECIMAL(8,6),
	CheckTime		INTEGER			NOT NULL,
	PRIMARY KEY (NodeID),
	FOREIGN KEY (StateID) REFERENCES States(StateID),
	FOREIGN KEY (CountryID) REFERENCES Countries(CountryID),
	FOREIGN KEY (VersionID) REFERENCES Versions(VersionID),
	FOREIGN KEY (SubversionID) REFERENCES Subversions(SubversionID),
	UNIQUE (IP, Port)
) //

DROP PROCEDURE IF EXISTS SelectNode //
CREATE PROCEDURE SelectNode ( IN IP TEXT, IN Port INTEGER )
BEGIN
	SET @id = NULL;
	SET @ip = NULL;
	SET @port = NULL;
	SET @time = UNXI_TIMESTAMP();

	SELECT N.NodeID, N.IP, N.Port INTO @id, @ip, @port
	FROM Nodes AS N
	WHERE N.IP = IP AND N.Port = Port;

    IF isnull(@id) THEN
		INSERT INTO Nodes (IP, Port, CheckTime)
		VALUES (IP, Port, @time);
	END IF;
	
	SELECT N.NodeID, N.IP, N.Port
	FROM Nodes AS N
	WHERE N.IP = IP AND N.Port = Port;
END //

DROP PROCEDURE IF EXISTS UpdateNode //
CREATE PROCEDURE UpdateNode ( IN NodeID INTEGER, IN StateID INTEGER, IN CountryID INTEGER, IN VersionID INTEGER, IN SubversionID INTEGER, IN Longitude DECIMAL(9,6), IN Latitude DECIMAL(8,6) )
BEGIN
	SET @time = UNXI_TIMESTAMP();

	UPDATE Nodes AS N
	SET N.StateID = StateID
	  , N.CountryID = CountryID
	  , N.VersionID = VersionID
	  , N.SubversionID = SubversionID
	  , N.Longitude = Longitude
	  , N.Latitude = Latitude
	WHERE N.NodeID = NodeID;

	SELECT N.*
	FROM Nodes AS N
	WHERE N.StateID <=> StateID
	  AND N.CountryID <=> CountryID
	  AND N.VersionID <=> VersionID
	  AND N.SubversionID <=> SubversionID
	  AND N.Longitude <=> Longitude
	  AND N.Latitude <=> Latitude;
END //