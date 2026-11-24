-- Set of SQL statements to drop the above three relations
use HW5;
-- Drop SHIPMENT first because it contains foreign keys
-- that reference SUPPLIER and PART
DROP TABLE SHIPMENT;


-- Drop the PART table
DROP TABLE PART;


-- Drop the SUPPLIER table
DROP TABLE SUPPLIER;