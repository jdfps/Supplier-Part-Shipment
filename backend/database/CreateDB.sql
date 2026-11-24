# Set of SQL statements to create the above three relations

-- drop db if it is already existing
drop database if exists HW5;

-- create a new version of everything
create database HW5;

-- go ahead and use that puppy (:
use HW5;


CREATE TABLE SUPPLIER
(
    -- Supplier number uniquely identifies each supplier
    Sno VARCHAR(2) PRIMARY KEY,

    -- Supplier name cannot be NULL
    Sname VARCHAR(50) NOT NULL,

    -- Status must be a positive number
    Status INT CHECK (Status > 0),

    -- City may be NULL
    City VARCHAR(50)
);

CREATE TABLE PART
(
    -- Part number uniquely identifies each part
    Pno VARCHAR(2) PRIMARY KEY,

    -- Part name cannot be NULL
    Pname VARCHAR(50) NOT NULL,

    -- Color may be NULL
    Color VARCHAR(50),

    -- Weight must be between 1 and 100 inclusive
    Weight INT CHECK (Weight BETWEEN 1 AND 100),

    -- City where the part is stored
    City VARCHAR(50),

    -- The combination of Pname and Color must be unique
    UNIQUE (Pname, Color)
);

CREATE TABLE SHIPMENT
(
    -- Supplier number
    Sno VARCHAR(2),

    -- Part number
    Pno VARCHAR(2),

    -- Quantity defaults to 100 if no value is provided
    Qty INT DEFAULT 100,

    -- Price must be positive
    Price DECIMAL(10,3) CHECK (Price > 0),

    -- Sno and Pno together uniquely identify a shipment
    PRIMARY KEY (Sno, Pno),

    -- Sno must reference an existing supplier
    FOREIGN KEY (Sno) REFERENCES SUPPLIER(Sno),

    -- Pno must reference an existing part
    FOREIGN KEY (Pno) REFERENCES PART(Pno)
);