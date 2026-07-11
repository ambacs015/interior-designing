# AI Interior Designer

A modern, production-ready full-stack web application that allows users to upload a room image, select an interior design style, and receive AI-generated design recommendations along with a redesigned room preview.

## Features

- **Authentication**: JWT-based login and registration with bcrypt password hashing.
- **Upload Room**: Securely upload images of your room.
- **AI Design Generation**: (Mocked) generation of room designs based on user-selected styles (Modern, Luxury, Minimalist, etc.).
- **Dashboard**: View, search, and filter your past generated designs.
- **PDF Export**: Download your AI design recommendations as a PDF.
- **Dark Mode**: Fully implemented responsive dark mode toggle.
- **Modern UI**: Stunning, animated interface built with Tailwind CSS, Framer Motion, and Lucide React.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Framer Motion, html2pdf.js.
- **Backend**: Python, Flask, Flask-CORS, PyJWT, bcrypt.
- **Database**: SQLite (local) / MySQL (production ready via generic connection strings).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)

### Installation

1. **Clone the repository** (or download the project folder).

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```
   *Note: Ensure `PyJWT` and `bcrypt` are installed.*

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd backend
   # Ensure virtual environment is activated
   python app.py
   ```
   The backend will run on `http://127.0.0.1:5000`.

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173`.

### API Documentation

- `POST /api/register`: Register a new user (`name`, `email`, `password`).
- `POST /api/login`: Authenticate and receive a JWT (`email`, `password`).
- `POST /api/upload`: Upload a room image (multipart/form-data with `file`).
- `POST /api/recommendation`: Get an AI recommendation based on image and style.
- `GET /api/designs`: Fetch user's saved designs.
- `POST /api/designs/save`: Save a generated design to the database.

*Protected endpoints require an `Authorization: Bearer <token>` header.*

## Deployment

- **Frontend**: Designed for seamless deployment on Vercel or Netlify (build command: `npm run build`).
- **Backend**: Designed for deployment on Render, Heroku, or similar PaaS providers. Uses standard WSGI (gunicorn) setups. Ensure `SECRET_KEY` and database URLs are set in environment variables.

---
© 2026 AI Interiors Inc.
