import os

from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL


# load .env file
load_dotenv()

# read database cred.
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT" , "3306"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# create the URL connection
DATABSE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME
)

# create db engine

# pool_pre_ping helps detect stale db connections
engine = create_engine(
    DATABSE_URL,
    pool_pre_ping=True
)