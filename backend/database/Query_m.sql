# set of sql statements for given quieries running on MS SQL Server

-- use the correct DB so we can pull the right information
use HW3and4_CSCI_4560;



-- 1.	Print supplier numbers for suppliers who are located in the same city as supplier S1. Do not include S1 in the answer.
			-- select City from SUPPLIER where Sno = "s1";
            select Sno from SUPPLIER
            where City = (select City from SUPPLIER where Sno = "s1")
            and Sno <> "s1";
-- 2.	Print supplier numbers for suppliers who ship at least all those parts shipped by supplier S3.  Do not include S3 in the answer and do not "count".
            select s.Sno from SUPPLIER as s
            where s.Sno <> "s3"
            and not exists (select 1 from SHIPMENT as required
                            where required.Sno = "s3"
                            and not exists (select 1 from SHIPMENT as shipped
                                            where shipped.Sno = s.Sno
                                            and shipped.Pno = required.Pno));
-- 3.	Print supplier numbers for suppliers who ship at least one type of red part.
-- 4.	Print supplier numbers for suppliers who do not ship any red parts.
-- 5.	Print supplier numbers for suppliers who ship ONLY red parts.
-- 6.	Print supplier names for suppliers who do not currently ship any parts.
-- 7.	Print supplier names for suppliers who ship at least one part that is also shipped by supplier S2.  Do not include S2 in the answer.
-- 8.	Print supplier numbers for suppliers with status value less than the current average status value of all suppliers.
-- 9.	Print all the shipment information for the shipment(s) with the highest unit cost (i.e. price).
-- 10.	Print all the shipment information for the shipment(s) with the highest total cost, (i.e. price*Qty).
-- 11.	Print all the supplier information for the supplier(s) making the most money.  The supplier money is determined by the sum of all shipment cost.  Each shipment cost is found by the number of units being shipped times the price per unit.
-- 12.	For each supplier (including the one who doesn’t ship any parts), print the supplier number and how many different parts shipped.  For example, S1 6; S2 2, ... 
-- 13.	For each supplier (including the one who doesn’t ship any parts), print the supplier number, supplier name, total cost of all shipments, and how many different parts shipped.
