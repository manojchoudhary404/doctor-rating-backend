# 🩺 Doctor Rating System

A full-stack web application for managing patient reviews and ratings for doctors. Built with React.js (frontend), Node.js + Express.js (backend), and MySQL (database).

---

## 📁 Project Structure

```
doctor-rating-system/
├── doctor-rating-backend/       ← Express.js REST API
│   ├── config/
│   │   └── db.js                ← MySQL connection pool
│   ├── controllers/
│   │   ├── reviewController.js  ← Review CRUD logic
│   │   └── doctorController.js  ← Doctor listing logic
│   ├── middleware/
│   │   └── validators.js        ← express-validator rules
│   ├── routes/
│   │   ├── reviews.js           ← /reviews routes
│   │   └── doctors.js           ← /doctors routes
│   ├── schema.sql               ← MySQL DDL + seed data
│   ├── server.js                ← Express entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── doctor-rating-frontend/      ← React.js SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── StarRating.jsx   ← Reusable star UI
    │   │   ├── DoctorCard.jsx   ← Listing card
    │   │   ├── ReviewCard.jsx   ← Review item
    │   │   ├── ReviewModal.jsx  ← Add / Edit modal
    │   │   └── DeleteModal.jsx  ← Delete confirmation
    │   ├── context/
    │   │   └── ToastContext.jsx ← Global toast notifications
    │   ├── pages/
    │   │   ├── DoctorsPage.jsx  ← Doctor listing + filters
    │   │   └── DoctorDetailPage.jsx ← Profile + reviews CRUD
    │   ├── services/
    │   │   └── api.js           ← Axios API layer
    │   ├── App.js               ← Router setup
    │   ├── App.css              ← Full design system
    │   └── index.js
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## 🗄️ Database Setup

### Prerequisites
- MySQL 8.0+

### Steps

```bash
# 1. Log in to MySQL
mysql -u root -p

# 2. Run the schema file
source /path/to/doctor-rating-backend/schema.sql;
# OR
mysql -u root -p < doctor-rating-backend/schema.sql
```

This creates:
- `doctor_rating_db` database
- `doctors` table with 6 seed doctors
- `doctor_reviews` table with 9 seed reviews

---

## ⚙️ Backend Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

```bash
cd doctor-rating-backend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=doctor_rating_db
FRONTEND_URL=http://localhost:3000
```

```bash
# 3. Start development server
npm run dev        # with nodemon (auto-restart)
# OR
npm start          # plain node
```

✅ API running at: `http://localhost:5000`

### API Endpoints

| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| GET    | `/`                     | Health check                 |
| GET    | `/doctors`              | List all doctors (with filters) |
| GET    | `/doctors/:id`          | Get doctor by ID             |
| POST   | `/reviews`              | Add new review               |
| GET    | `/reviews/:doctor_id`   | Get all reviews for a doctor |
| GET    | `/reviews/single/:id`   | Get single review            |
| PUT    | `/reviews/:id`          | Update review                |
| DELETE`| `/reviews/:id`          | Delete review                |

### Query Parameters

**GET /doctors**
- `search` — search name or specialty
- `specialty` — filter by exact specialty
- `min_rating` — minimum average rating (e.g., `4`)

**GET /reviews/:doctor_id**
- `status` — filter by `Visible` / `Hidden` / `Reported`
- `page` — page number (default: 1)
- `limit` — reviews per page (default: 10)

---

## 🎨 Frontend Setup

### Prerequisites
- Node.js 18+

### Steps

```bash
cd doctor-rating-frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

```bash
# 3. Start the dev server
npm start
```

✅ App running at: `http://localhost:3000`

---

## 🚀 Running Both Together

Open two terminals:

**Terminal 1 — Backend**
```bash
cd doctor-rating-backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd doctor-rating-frontend
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

### Core
- ✅ Full CRUD for patient reviews
- ✅ Dynamic average rating calculation
- ✅ Star rating UI (1–5 stars, interactive)
- ✅ Add / Edit / Delete via modal dialogs
- ✅ Toast notifications (success & error)
- ✅ Review status management (Visible / Hidden / Reported)

### Search & Filter
- ✅ Search doctors by name or specialty
- ✅ Filter by specialty
- ✅ Filter by minimum star rating
- ✅ Filter reviews by status

### UX
- ✅ Skeleton loading cards
- ✅ Responsive design (mobile-first)
- ✅ Pagination for reviews (5 per page)
- ✅ Rating breakdown bar chart
- ✅ Form validation (frontend + backend)

---

## 🛡️ Validation Rules

| Field        | Rules                                      |
|--------------|--------------------------------------------|
| doctor_id    | Required, positive integer                 |
| patient_id   | Required, positive integer                 |
| patient_name | Required, string, max 255 chars            |
| rating       | Required, integer 1–5                      |
| review_text  | Optional, string, max 1000 chars           |
| status       | Optional, one of: Visible / Hidden / Reported |

---

## 🗂️ Database Schema

```sql
CREATE TABLE doctor_reviews (
    review_id    INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id    INT NOT NULL,
    patient_id   INT NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text  VARCHAR(1000) NULL,
    review_date  DATE DEFAULT (CURRENT_DATE),
    status       ENUM('Visible','Hidden','Reported') DEFAULT 'Visible',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | React 18, React Router v6, Axios |
| Backend   | Node.js, Express.js 4, express-validator |
| Database  | MySQL 8, mysql2 (promise-based pool) |
| Styling   | Pure CSS with custom design system |

---

## 📦 Build for Production

**Backend** — no build step needed; deploy directly with:
```bash
npm start
```

**Frontend**
```bash
npm run build
# Outputs to /build — serve with nginx or any static host
```
