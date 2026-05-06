# Smart Pothole & Traffic Management System

A presentation-ready hackathon MVP for reporting potholes with image and GPS data, detecting road damage with YOLOv8/OpenCV, prioritizing complaints, showing reports on a map, and broadcasting realtime traffic alerts.

## Folder Structure

```txt
smart-pothole-traffic-system/
├── package.json
├── .env.example
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config.js
│       ├── db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── ai-service/
│   ├── app.py
│   ├── requirements.txt
│   ├── README.md
│   ├── model/
│   ├── uploads/
│   └── outputs/
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── styles.css
        ├── components/
        ├── pages/
        ├── services/
        └── utils/
```

## Required Stack

```txt
Frontend    React.js + Tailwind CSS
Backend     Node.js + Express
Database    MongoDB Atlas or local MongoDB
AI          YOLOv8 + OpenCV through FastAPI
Maps        Leaflet.js
Realtime    Socket.IO
```

## Install Dependencies

From the project root:

```bash
npm run install:all
```

## MongoDB Atlas Cloud Setup

No code rewrite is required for MongoDB Atlas. The backend already reads the database connection from `MONGO_URI`.

1. Create a free MongoDB Atlas cluster.
2. Go to `Database Access` and create a database user.
3. Go to `Network Access` and allow your current IP. For hackathon demo only, you can allow `0.0.0.0/0`.
4. Go to `Database -> Connect -> Drivers -> Node.js`.
5. Copy the `mongodb+srv://...` connection string.
6. Add the database name before the query string.

Example:

```txt
mongodb+srv://roadadmin:RoadAdmin12345@cluster0.xxxxx.mongodb.net/smart_pothole_traffic?retryWrites=true&w=majority
```

Create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/smart_pothole_traffic?retryWrites=true&w=majority
AI_SERVICE_URL=http://localhost:8000
```

If your password contains special characters like `@`, `#`, `/`, `:`, or `?`, URL-encode it or use a simpler demo password.

## Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## AI Service Setup

Windows:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

macOS:

```bash
brew install python@3.11
rm -rf ai-service/.venv
cd ai-service
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cd ..
```

Place your trained YOLOv8 pothole model here:

```txt
ai-service/model/pothole_detector.pt
```

If the model is missing, the AI service still runs using an OpenCV fallback detector.

## Run The App

Use three separate terminals.

Terminal 1, AI service on macOS:

```bash
npm run dev:ai:mac
```

Terminal 1, AI service on Windows:

```bash
npm run dev:ai:win
```

Terminal 2, backend:

```bash
npm run dev:backend
```

Terminal 3, frontend:

```bash
npm run dev:frontend
```

Open:

```txt
http://localhost:5173
```

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API health check |
| GET | `/api/reports` | List pothole reports |
| POST | `/api/reports` | Create report with image, GPS, AI detection, and priority score |
| PATCH | `/api/reports/:id/status` | Update report status |
| GET | `/api/complaints` | List complaints |
| POST | `/api/complaints` | Create complaint |
| PATCH | `/api/complaints/:id/status` | Update complaint status |
| GET | `/api/traffic-alerts` | List traffic alerts |
| POST | `/api/traffic-alerts` | Create traffic alert |
| GET | `/api/analytics` | Dashboard analytics |

AI service routes:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | AI service health check |
| POST | `/detect` | Detect potholes from uploaded image |

Socket.IO events:

```txt
report:created
report:updated
complaint:created
complaint:updated
traffic:created
```

## Deployment

Backend on Render:

1. Create a new Web Service.
2. Root directory: `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add `MONGO_URI` from MongoDB Atlas.
6. Add `AI_SERVICE_URL` from the deployed AI service.
7. Add `CLIENT_URL` from the deployed frontend.

AI service on Render:

1. Create a Python Web Service.
2. Root directory: `ai-service`.
3. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`.

Frontend on Vercel:

1. Import repository.
2. Root directory: `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL=https://your-backend-url/api`.
6. Add `VITE_SOCKET_URL=https://your-backend-url`.