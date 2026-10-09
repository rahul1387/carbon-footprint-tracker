# Carbon Footprint Tracker

A lightweight HTML + CSS + JavaScript website for tracking daily transportation, food,
shopping, and other emissions, backed by a small Express server and a **local MongoDB**
database.

## Features

- Landing page and responsive navigation
- Dashboard with live Green/Red traffic light signals and budget tracker
- Multi-day carbon footprint analysis with day-by-day comparison and automated insights
- 3-day fake/sample data generator for demonstration and testing (`npm run seed` or UI button)
- Activity tracking for transport, food, shopping, and other categories
- Activity history with time filters (today / week / month) and emission level indicators
- Personalized low-carbon recommendations
- Persistence in a local MongoDB database (with automatic localStorage migration and
  offline fallback)
- Mobile-friendly navigation

## Project structure

```text
carbon-footprint-tracker/
├── index.html
├── dashboard.html
├── add-activity.html
├── history.html
├── recommendations.html
├── server.js            # Express server: static files + REST API
├── package.json
├── css/
│   ├── style.css
│   └── components.css
├── js/
│   ├── app.js           # Navigation helpers
│   ├── data.js          # Emission factors
│   ├── calculations.js  # CO2e calculations
│   ├── activity.js      # Add Activity page
│   ├── dashboard.js     # Dashboard page
│   ├── history.js       # History page
│   ├── recommendations.js
│   └── storage.js       # Data layer (MongoDB API + localStorage fallback)
└── README.md
```

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A local MongoDB instance running on `mongodb://127.0.0.1:27017`
  (Windows service: `net start MongoDB`)

### Steps

```bash
npm install
npm start
```

Then open **http://localhost:3000**

To load the 3-day fake scenario (Green/Red signal demo) at any time:

```bash
npm run seed
```

Or click **"🌱 Load 3-Day Fake Data"** directly from the top of the dashboard page.

To use a different MongoDB instance:

```bash
set MONGODB_URI=mongodb://127.0.0.1:27017   # Windows
export MONGODB_URI=mongodb://127.0.0.1:27017 # macOS / Linux
npm start
```

## API

| Method   | Route                    | Description                       |
| -------- | ------------------------ | --------------------------------- |
| `GET`    | `/api/health`            | Health / connectivity check       |
| `GET`    | `/api/activities`        | List all activities               |
| `POST`   | `/api/activities`        | Create or update an activity      |
| `DELETE` | `/api/activities/:id`    | Delete one activity               |
| `DELETE` | `/api/activities`        | Delete all activities             |

Data is stored in the `carbontrack` database, `activities` collection.

## Data behaviour

- When the Express server is running, activities are read from and written to MongoDB.
- If the backend is unreachable (for example the HTML files are opened directly from
  disk), the site automatically falls back to `localStorage` so it keeps working.
- Activities saved in `localStorage` from an earlier version are **migrated into
  MongoDB automatically** the first time the site loads against the backend.

## Notes

- Emission values are approximate and based on public reference factors for the MVP.
- The app uses `Estimated CO₂e` language rather than claiming exact scientific
  measurement.
