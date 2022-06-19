DELIMITER //
DROP TABLE IF EXISTS Nodes // 
CREATE TABLE Nodes (
	NodeID			INTEGER			NOT NULL	AUTO_INCREMENT,
	StateID			INTEGER 		NOT NULL	DEFAULT 1,
	CountryID		INTEGER,
	ProviderID		INTEGER,
	VersionID		INTEGER,
	SubversionID	INTEGER,
	IP				VARCHAR(255)	NOT NULL,
	Port			INTEGER			NOT NULL,
	Longitude		DECIMAL(9,6),
	Latitude		DECIMAL(8,6),
	CheckTime		INTEGER			NOT NULL,
	PRIMARY KEY (NodeID),
	FOREIGN KEY (StateID) REFERENCES States(StateID),
	FOREIGN KEY (CountryID) REFERENCES Countries(CountryID),
	FOREIGN KEY (ProviderID) REFERENCES Providers(ProviderID),
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
	SET @time = UNIX_TIMESTAMP();

	SELECT N.NodeID, N.IP, N.Port INTO @id, @ip, @port
	FROM Nodes AS N
	WHERE N.IP = IP AND N.Port = Port;

    IF isnull(@id) THEN
		INSERT INTO Nodes (IP, Port, CheckTime)
		VALUES (IP, Port, @time);
	END IF;
	
	SELECT N.*
	FROM Nodes AS N
	WHERE N.IP = IP AND N.Port = Port;
END //

DROP PROCEDURE IF EXISTS UpdateNodeInfo //
CREATE PROCEDURE UpdateNodeInfo ( IN NodeID INTEGER, IN StateID INTEGER, IN VersionID INTEGER, IN SubversionID INTEGER )
BEGIN
	SET @time = UNIX_TIMESTAMP();

	UPDATE Nodes AS N
	SET N.StateID = StateID
	  , N.VersionID = VersionID
	  , N.SubversionID = SubversionID
	  , N.CheckTime = @time
	WHERE N.NodeID = NodeID;

	SELECT N.*
	FROM Nodes AS N
	WHERE N.StateID <=> StateID
	  AND N.VersionID <=> VersionID
	  AND N.SubversionID <=> SubversionID
	  AND N.CheckTime = @time;
END //

DROP PROCEDURE IF EXISTS UpdateNodeLocation //
CREATE PROCEDURE UpdateNodeLocation ( IN IP TEXT, IN CountryID INTEGER, IN ProviderID INTEGER, IN Longitude DECIMAL(9,6), IN Latitude DECIMAL(8,6) )
BEGIN
	UPDATE Nodes AS N
	SET N.CountryID = CountryID
	  , N.ProviderID = ProviderID
	  , N.Longitude = Longitude
	  , N.Latitude = Latitude
	WHERE N.IP = IP;

	SELECT N.*
	FROM Nodes AS N
	WHERE N.IP <=> IP
	  AND N.CountryID <=> CountryID
	  AND N.ProviderID <=> ProviderID
	  AND N.Longitude <=> Longitude
	  AND N.Latitude <=> Latitude;
END //

DROP PROCEDURE IF EXISTS SelectOneNodeByState //
CREATE PROCEDURE SelectOneNodeByState ( IN StateID INTEGER )
BEGIN
	SELECT N.*
	FROM Nodes AS N
	WHERE N.StateID = StateID
	LIMIT 1;
END //

DROP PROCEDURE IF EXISTS SelectRandomNodeByState //
CREATE PROCEDURE SelectRandomNodeByState ( IN StateID INTEGER )
BEGIN
	SELECT N.*, RAND() AS Random
	FROM Nodes AS N
	WHERE N.StateID = StateID
	ORDER BY Random
	LIMIT 1;
END //

DROP PROCEDURE IF EXISTS SelectAllNodes //
CREATE PROCEDURE SelectAllNodes ()
BEGIN
	SELECT N.IP AS 'ip', N.Port AS 'port', V.Number AS 'version', S.Name AS 'subversion'
	FROM Nodes AS N, Subversions AS S, Versions AS V
	WHERE N.SubversionID = S.SubversionID
		AND N.VersionID = V.VersionID
		AND N.StateID = 2;
END //

DROP PROCEDURE IF EXISTS SelectAllNodesInfo //
CREATE PROCEDURE SelectAllNodesInfo ()
BEGIN
	SELECT N.IP AS 'ip', N.Port AS 'port', V.Number AS 'version', S.Name AS 'subversion', C.Name AS 'country', P.Name AS 'provider'
	FROM Nodes AS N, Subversions AS S, Versions AS V, Countries AS C, Providers AS P
	WHERE N.SubversionID = S.SubversionID
		AND N.VersionID = V.VersionID
		AND N.CountryID = C.CountryID
		AND N.ProviderID = P.ProviderID
		AND N.StateID = 2;
END //

DROP PROCEDURE IF EXISTS SelectAllNodesLocation //
CREATE PROCEDURE SelectAllNodesLocation ()
BEGIN
	SELECT N.IP AS 'ip', N.Port AS 'port', V.Number AS 'version', S.Name AS 'subversion', N.Longitude AS 'longitude', N.Latitude AS 'latitude'
	FROM Nodes AS N, Subversions AS S, Versions AS V
	WHERE N.SubversionID = S.SubversionID
		AND N.VersionID = V.VersionID
		AND N.StateID = 2;
END //

DROP PROCEDURE IF EXISTS SelectNodesPerSubVersion //
CREATE PROCEDURE SelectNodesPerSubVersion ()
BEGIN
	SELECT S.Name, COUNT(*) AS Quantity
	FROM Nodes AS N, Subversions AS S
	WHERE N.SubversionID = S.SubversionID
    GROUP BY N.SubversionID;
END //

DROP PROCEDURE IF EXISTS SelectNodesPerCountry //
CREATE PROCEDURE SelectNodesPerCountry ()
BEGIN
	SELECT C.Name, C.Code, COUNT(*) AS Quantity
	FROM Nodes AS N, Countries AS C
	WHERE N.CountryID = C.CountryID
    GROUP BY C.Name
	ORDER BY Quantity DESC;
END //

DROP PROCEDURE IF EXISTS SelectUnlocatedNodeByState //
CREATE PROCEDURE SelectUnlocatedNodeByState ( IN StateID INTEGER )
BEGIN
	SELECT N.*, RAND() AS Random
	FROM Nodes AS N
	WHERE N.StateID = StateID
		  AND isnull(N.Longitude)
		  AND isnull(N.Latitude)
	ORDER BY Random
	LIMIT 1;
END //

DROP PROCEDURE IF EXISTS ResetCheckedNodes //
CREATE PROCEDURE ResetCheckedNodes ( )
BEGIN
	UPDATE Nodes AS N
	SET N.StateID = 1
	WHERE N.StateID = 3;
END //
