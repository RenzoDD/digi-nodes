DELIMITER //
DROP TABLE IF EXISTS States // 
CREATE TABLE States (
	StateID	INTEGER	NOT NULL AUTO_INCREMENT,
	Name	TEXT	NOT NULL,
	PRIMARY KEY (StateID)
) //

INSERT INTO States (Name)
VALUES ('Unchecked'), ('Active'), ('Inactive') //