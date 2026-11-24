# SupplyDesk frontend

Run the existing backend from `backend` using `python -m uvicorn app.main:app --reload` with your existing database credentials. From `frontend`, run `npm install` then `npm run dev` and open the URL Vite prints (usually http://localhost:5173).

The frontend sends requests to `/api`; Vite forwards them to FastAPI on http://127.0.0.1:8000 and strips the `/api` prefix. This avoids cross-origin requests without modifying the backend. Optionally copy `.env.example` to `.env` to change the backend target. Restart Vite after changing it. `npm run build` and `npm run preview` also work with the configured preview proxy; a separate production static host would need its own `/api` reverse proxy.

Use Test API & database to check both health routes, Load suppliers to display all records, Insert/Delete for each fixed shipment, Increase/Decrease for the supplier status operations, and the part search to find matching suppliers. Successful status updates display the returned supplier list immediately. Successful mutations clear previous part search results so stale data is not displayed; search again to refresh. The backend has no shipment-list endpoint, so the shipment cards describe the fixed records and show operation results, not current database existence.

Decreasing by 10% is not an exact reversal of increasing by 10%. Status mutations affect every supplier. Duplicate inserts or missing deletes display the backend's error message.
