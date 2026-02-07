# FixITDesk

FixITDesk is a full-stack helpdesk application built with **Django (REST API)** and **React**.

This README describes how to run the project **locally without Docker**, using:
- Python virtual environment (`venv`)
- React development server

---

## 🧱 Tech Stack

- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: React (Create React App)
- Database: SQLite (local dev)
- Auth: JWT stored in cookies

---

## 📦 Prerequisites

Make sure you have installed:

- Python 3.10+
- Node.js 18+
- npm

Check versions:

```bash
python --version
node --version
npm --version
```

🚀 Local Development Setup
1️⃣ Clone the repository
git clone https://github.com/ZoltanKarika/FixITDesk.git
cd FixITDesk

2️⃣ Backend setup (Django)

Create and activate a virtual environment:
```
python -m venv .venv
```

Activate it:

Linux / macOS
```
source .venv/bin/activate
```

Windows (PowerShell)
```
.venv\Scripts\Activate.ps1
```

Install dependencies:
```
pip install --upgrade pip
pip install -r requirements.txt
```

Run database migrations:
```
python manage.py migrate
```

Start the Django server:
```
python manage.py runserver
```

Backend runs at:
```
http://127.0.0.1:8000
```
3️⃣ Frontend setup (React)

Open a new terminal and go to the frontend folder:
```
cd fixitdesk-frontend
```

Install dependencies:
```
npm install
```

Create an environment file:
```
# fixitdesk-frontend/.env.development.local
REACT_APP_API_URL=http://127.0.0.1:8000
```

Start the frontend:
```
npm start
```

Frontend runs at:
```
http://localhost:3000
```
🔐 Authentication Notes

JWT tokens are stored in HTTP cookies

CORS is configured for local development

Backend must be running before frontend login/register

🐳 Docker (optional)

Docker support is included for production-like environments.
Local development does not require Docker.

🧼 Common Issues
❌ Browser redirects to HTTPS

Clear browser HSTS cache or use Incognito mode.

❌ CORS errors

Ensure frontend is running on http://localhost:3000
and backend on http://127.0.0.1:8000.
