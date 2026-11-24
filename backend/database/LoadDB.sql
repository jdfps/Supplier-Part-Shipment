# set of SQL statements to load the above data to the database

-- make sure we are putting info in same database (:
use HW3and4_CSCI_4560;

-- load data into SUPPLIER
INSERT INTO SUPPLIER (Sno, Sname, Status, City)
VALUES
    ('s1', 'Smith', 20, 'London'),
    ('s2', 'Jones', 10, 'Paris'),
    ('s3', 'Blake', 30, 'Paris'),
    ('s4', 'Clark', 20, 'London'),
    ('s5', 'Adams', 30, NULL);


-- Load data into PART
INSERT INTO PART (Pno, Pname, Color, Weight, City)
VALUES
    ('p1', 'Nut',   'Red',   12, 'London'),
    ('p2', 'Bolt',  'Green', 17, 'Paris'),
    ('p3', 'Screw', NULL,    17, 'Rome'),
    ('p4', 'Screw', 'Red',   14, 'London'),
    ('p5', 'Cam',   'Blue',  12, 'Paris'),
    ('p6', 'Cog',   'Red',   19, 'London');


-- Load data into SHIPMENT
INSERT INTO SHIPMENT (Sno, Pno, Qty, Price)
VALUES
    ('s1', 'p1', 300, .005),
    ('s1', 'p2', 200, .009),
    ('s1', 'p3', 400, .004),
    ('s1', 'p4', 200, .009),
    ('s1', 'p5', 100, .01),
    ('s1', 'p6', 100, .01),
    ('s2', 'p1', 300, .006),
    ('s2', 'p2', 400, .004),
    ('s3', 'p2', 200, .009),
    ('s3', 'p3', 200, NULL),
    ('s4', 'p2', 200, .008),
    ('s4', 'p3', NULL, NULL),
    ('s4', 'p4', 300, .006),
    ('s4', 'p5', 400, .003);