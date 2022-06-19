DELIMITER //
DROP TABLE IF EXISTS Connections // 
CREATE TABLE Connections (
	NodeA   INTEGER	NOT NULL,
	NodeB   INTEGER	NOT NULL,
	PRIMARY KEY (NodeA, NodeB),
    FOREIGN KEY (NodeA) REFERENCES Nodes(NodeID),
    FOREIGN KEY (NodeB) REFERENCES Nodes(NodeID)
) //

DROP PROCEDURE IF EXISTS SelectConnections //
CREATE PROCEDURE SelectConnections ( IN NodeA INTEGER, IN NodeB INTEGER )
BEGIN
	SET @a = NULL;
	SET @b = NULL;
    
	SELECT C.NodeA, C.NodeB INTO @a, @b
	FROM Connections AS C
	WHERE C.NodeA = NodeA AND C.NodeB = NodeB;
    
    IF isnull(@a) THEN
		INSERT INTO Connections (NodeA, NodeB)
        VALUES (NodeA, NodeB);
    END IF;
    
	SELECT C.NodeA, C.NodeB
	FROM Connections AS C
	WHERE C.NodeA = NodeA AND C.NodeB = NodeB;
END //
