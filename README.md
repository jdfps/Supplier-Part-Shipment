# Supplier-Part-Shipment

A simple database application for CSCI 4560 (Database Management Systems). The application uses a React frontend, a FastAPI backend, and a MySQL database to manage suppliers and shipments.

The application allows users to view all suppliers, increase or decrease supplier status by 10%, add and remove two predefined shipments, and search for suppliers by part number. Search queries use bound SQL parameters to protect against SQL injection.

## Getting started

There are two ways to run the project: with Docker Compose or manually. Docker is the easiest option once the Dockerfiles and Compose configuration are in place.

## Option 1: Docker Compose

### Requirements

- Docker Desktop (or Docker Engine with the Compose plugin)
- Git, if cloning the repository

Open a terminal in the root of the project, where `docker-compose.yaml` is located.

### Environment variables

Create a `.env` file in the root directory with the following values:

```dotenv
DB_NAME=HW5
DB_USER=supplier_app
DB_PASSWORD=your_app_password
MYSQL_ROOT_PASSWORD=your_root_password
```

Replace the example passwords with your own. Do not commit this file to Git.

The Compose configuration should pass these credentials to MySQL and the backend, set `DB_HOST=db` and `DB_PORT=3306` for FastAPI, and set `VITE_API_URL=http://backend:8000` for the frontend proxy.

### Start the application

```bash
docker compose up --build -d
```

On the first startup, MySQL creates its database using the following SQL scripts mounted into `/docker-entrypoint-initdb.d/` in this order:

1. `backend/database/CreateDB.sql` — creates the HW5 database and its tables.
2. `backend/database/LoadDB.sql` — loads the initial supplier, part, and shipment records.

These scripts run automatically only when MySQL initializes a new, empty data volume. You do not need to run them manually when using this setup.

Once the containers are running, open the frontend at http://localhost:5173.

| Service | Address |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API documentation | http://localhost:8000/docs |
| Database connection test | http://localhost:8000/test-db |
| MySQL (Workbench) | localhost:3307 |

The MySQL port assumes the Compose mapping `3307:3306`. Use port 3307 when connecting from your computer and port 3306 when connecting between containers.

### Stop or restart the application

```bash
docker compose down
```

To start it again:

```bash
docker compose up -d
```

Database changes are saved in the named MySQL volume, so stopping the containers does not reset the data.

If you change the application code, rebuild the images with `docker compose up --build -d`.

### Reset the database

To restore the original assignment data:

```bash
docker compose down -v
docker compose up --build -d
```

**Warning:** This deletes the Compose project's database volume and all changes stored in it. The SQL scripts will run again during initialization.

## Option 2: Manual setup (without Docker)

### Requirements

- Python 3.13 (recommended)
- Node.js 24 and npm (recommended)
- MySQL Server 8.x
- MySQL Workbench or the MySQL command-line client

### 1. Create and load the database

Start your local MySQL server. In MySQL Workbench, connect to your server and open and execute these files in order:

1. `backend/database/CreateDB.sql`
2. `backend/database/LoadDB.sql`

Alternatively, from a terminal at the project root, use the MySQL client (the commands below work in Bash or Command Prompt):

```bash
mysql -u root -p < backend/database/CreateDB.sql
mysql -u root -p < backend/database/LoadDB.sql
```

`CreateDB.sql` drops and recreates HW5, so only run it when setting up or intentionally resetting the database. Do not run `LoadDB.sql` repeatedly against an already populated database.

Verify the data in Workbench:

```sql
USE HW5;
SELECT * FROM SUPPLIER;
SELECT * FROM PART;
SELECT * FROM SHIPMENT;
```

The original data contains 5 suppliers, 6 parts, and 14 shipments.

### 2. Set up the backend

Create a `.env` file inside the `backend` directory:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=HW5
```

Use your own MySQL credentials. A dedicated database user with access to HW5 is preferable to root; root is shown only as a simple local example.

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

Install the dependencies and start FastAPI:

```bash
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Visit http://127.0.0.1:8000/test-db to verify the connection. Leave this terminal running.

### 3. Set up the frontend

Open a second terminal at the project root:

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. The Vite proxy forwards frontend API requests to FastAPI at `http://127.0.0.1:8000` by default. No additional frontend environment variables are needed for the default manual setup.

## API endpoints

The API can also be tested directly through Swagger UI at `/docs`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Check backend availability |
| GET | `/test-db` | Test the database connection |
| GET | `/get-all-suppliers` | Retrieve all suppliers |
| PUT | `/increase-status` | Increase supplier status by 10% |
| PUT | `/decrease-status` | Decrease supplier status by 10% |
| POST | `/add-shipment1` | Insert the first predefined shipment |
| POST | `/add-shipment2` | Insert the second predefined shipment |
| DELETE | `/delete-shipment1` | Remove the first predefined shipment |
| DELETE | `/delete-shipment2` | Remove the second predefined shipment |
| GET | `/search?part_no=p3` | Find suppliers who shipped a particular part |

## A few notes for testing

- The initial data already contains a shipment for `s4` and `p2`. The second insertion will fail with a duplicate primary key error until that existing shipment is removed. Use the delete button first if you want to demonstrate a successful insertion.
- Inserting the same shipment twice will also fail because the supplier number and part number form a composite primary key.
- Each click on a status update button changes the current values. Decreasing by 10% does not exactly undo a 10% increase.
- Use Swagger UI to test POST, PUT, and DELETE requests rather than entering their URLs directly in the browser.

## Troubleshooting

For Docker, check the container status and logs:

```bash
docker compose ps
docker compose logs backend
docker compose logs db
docker compose logs frontend
```

If the frontend cannot reach the backend, check `/test-db` and make sure the backend is running. If the database connection fails, verify the credentials, database name and port. Inside Docker, the backend must use the database service name (`db`), not `localhost`.

If running MySQL manually on Linux, table names may be case-sensitive. The suggested Docker configuration uses `--lower-case-table-names=1` when initializing MySQL to accommodate the existing SQL queries.

## Project layout

```text
Supplier-Part-Shipment/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── database.py
│   ├── database/
│   │   ├── CreateDB.sql
│   │   ├── LoadDB.sql
│   │   ├── Query_m.sql
│   │   └── ClearDB.sql
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yaml
└── README.md
```



# Video Link!!!!!!

https://youtu.be/jSm8Bs-JKmI