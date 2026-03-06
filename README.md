# 📚 BookShare – PDF Book Sharing Platform

BookShare is a full-stack web application that allows users to upload, share, and download books in PDF format. The platform focuses on community sharing while including moderation tools, duplicate detection, and a credit-based system for downloads.

This project is built as a portfolio project to demonstrate modern full-stack development using **React, FastAPI, PostgreSQL, and Supabase storage**.

---

# 🚀 Features

### 🔐 Authentication

* Google Sign-In authentication
* Backend verification of Google ID tokens
* JWT-based session authentication

### 📤 Book Upload

* Upload PDF books
* Automatic **duplicate detection using SHA-256 hash**
* Categorization (Programming, Science, Comics, etc.)

### 📥 Book Download

* Download books uploaded by other users
* Credit-based download system

### 🧾 Reporting & Moderation

* Users can report books
* Admins can:

  * Remove books
  * Ban users
  * Review reports

### 🛡️ Anti-Piracy Safety Measures

* Users must confirm ownership or public domain status
* Community reporting system
* Moderation tools for administrators

---

# 🏗️ Architecture

```
Frontend (React)
        |
        | Google Sign-In
        v
Backend API (FastAPI)
        |
        | ORM
        v
PostgreSQL Database (Supabase)
        |
        | File Storage
        v
Supabase Storage (PDFs)
```

---

# 🧰 Tech Stack

### Frontend

* React
* Google OAuth
* Fetch API / Axios

### Backend

* FastAPI
* SQLAlchemy ORM
* JWT Authentication


### Database

* PostgreSQL (Supabase)

### Storage

* Supabase Storage (PDF files )

### Dev Tools

* Uvicorn (ASGI server)

---

# 📂 Project Structure

```
bookshare/
│
├── frontend/              # React application
│
├── backend/
│   ├── api/           # Route handlers
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   ├── db/            # Database configuration
│   └── main.py        # FastAPI entry point
│   └── requirements.txt
└── README.md
```

---


# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/bookshare.git
cd bookshare
```

---

## 2️⃣ Backend Setup

Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn app.main:app --reload
```

Server runs at:

```
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at:

```
http://localhost:3000
```

---

# 🔑 Environment Variables

Create `backend/.env` file:

```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_key
```
Create `frontend/.env` file:

```
VITE_APP_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:8000
```

---

# 📌 Future Improvements

* Comments & reviews
* Recommendation system

---

# ⚠️ Disclaimer

This platform is intended for educational and portfolio purposes. Users are responsible for ensuring that uploaded content complies with copyright laws.

---


# ⭐ Contributions

Pull requests and suggestions are welcome.

