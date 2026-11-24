# SupplyDesk frontend

Run from this directory:

```sh
npm install
npm run dev
```

The frontend uses React, Vite and plain CSS. No additional dependencies.

## Backend integration (proposed contract)
The backend currently only implements GET /. Implement these routes yourself or change the route strings in `src/App.jsx`.

- POST `/shipments`: JSON `{ "Sno": "s2", "Pno": "p3", "Qty": 200, "Price": 0.006 }`. Return `{ "success": true, "message": "Shipment inserted successfully." }` or an appropriate HTTP error with `detail`. Duplicate keys should be reported as failures.
- PATCH `/suppliers/status`: increase all supplier statuses by 10%; return a success/message object. Each click applies a new increase.
- GET `/suppliers`: return an array of `{ "Sno": "s1", "Sname": "Smith", "Status": 20, "City": "London" }`.
- GET `/suppliers/by-part?part_no=p2`: return the same array shape, filtered by part. Use parameterized SQL in the backend; frontend input validation and URL encoding do not prevent SQL injection.

The API defaults to `http://localhost:8000`. To override it, add `VITE_API_URL=http://localhost:8000` to a frontend `.env` file and restart Vite. Configure FastAPI CORS for your Vite origin (usually http://localhost:5173).

No mock success messages or fake supplier records are displayed. The interface can be viewed before the backend is implemented, but operations need the API.
