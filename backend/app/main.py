from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine

app = FastAPI()


@app.get("/")
def home():
    return {"msg" : "FastAPI is running"}

@app.get("/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("select 1"))
            return {
                "status":"success",
                "result":result.scalar()
            }
    except SQLAlchemyError:
        raise HTTPException(
            status_code = 500,
            detail = "database connection failed...."
        )

@app.get("/get-all-suppliers")
def get_suppliers():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("select * from SUPPLIER")
            )

        suppliers = result.mappings().all()

        return [dict(supplier) for supplier in suppliers]
    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="failed to retrive shipments"
        )

@app.put("/increase-status")
def updating_status():
    try:
        with engine.begin() as connection:
            connection.execute(
                text("update supplier set status = status + (status * 0.1)")
            )

            result = connection.execute(
                text("select * from supplier")
            )

            suppliers = result.mappings().all()
            return [dict(supplier) for supplier in suppliers]
    except SQLAlchemyError as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail="failed to increase supplier status"
            )

@app.put("/decrease-status")
def updating_status():
    try:
        with engine.begin() as connection:
            connection.execute(
                text("update supplier set status = status - (status * 0.1)")
            )

            result = connection.execute(
                text("select * from supplier")
            )

            suppliers = result.mappings().all()
            return [dict(supplier) for supplier in suppliers]
    except SQLAlchemyError as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail="failed to decrease supplier status"
            )

@app.post("/add-shipment1")
def add_shipment1():
    try:
        with engine.begin() as connection:
            connection.execute(
                text("""
                insert into shipment(sno,pno,qty,price) values('s2','p3',200,0.006)
                """)
            )
        return {"status" : "success"}
    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(
                        status_code=500,
                        detail="Failed to insert tuple ('s2', ‘p3’, 200, 0.006) into SHIPMENT table"
                    )

@app.post("/add-shipment2")
def add_shipment2():
    try:
        with engine.begin() as connection:
            connection.execute(
                text("""
                insert into shipment(sno,pno,qty,price) values('s4','p2',100,0.005)
                """)
            )
        return {"status" : "success"}
    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(
                        status_code=500,
                        detail="Failed to insert tuple ('s4', ‘p2’, 100, 0.005) into SHIPMENT table"
                    )


@app.delete("/delete-shipment1")
def delete_shipment1():
    try:
        with engine.begin() as connection:
            result = connection.execute(
                text("""
                    DELETE FROM SHIPMENT
                    WHERE Sno = 's2' AND Pno = 'p3'
                """)
            )

            if result.rowcount == 0:
                raise HTTPException(
                    status_code=404,
                    detail="Shipment not found"
                )

        return {"status": "success"}

    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Failed to delete shipment 1"
        )


@app.delete("/delete-shipment2")
def delete_shipment2():
    try:
        with engine.begin() as connection:
            result = connection.execute(
                text("""
                    DELETE FROM SHIPMENT
                    WHERE Sno = 's4' AND Pno = 'p2'
                """)
            )

            if result.rowcount == 0:
                raise HTTPException(
                    status_code=404,
                    detail="Shipment not found"
                )

        return {"status": "success"}

    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Failed to delete shipment 2"
        )


@app.get("/search")
def search(part_no:str):
    try:
        with engine.begin() as connection:
            result = connection.execute(
                text("""
                SELECT DISTINCT s.* FROM supplier AS s INNER JOIN shipment AS sh ON s.sno = sh.sno WHERE sh.pno = :part;
                """),
                {"part" : part_no}
            )
        suppliers = result.mappings().all()

        return [dict(supplier) for supplier in suppliers]
    except SQLAlchemyError as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to find pno {part_no}"
            )