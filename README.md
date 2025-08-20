# Lesson AI

This is a **full-stack project** with:

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + Prisma + MySQL

---

## 🚀 Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/muhammadshoaib123456/lesson_ai.git
cd lesson_ai
📂 Frontend (React + Vite)
Setup

cd lessn_frontend
npm install
Run Development Server

npm run dev
Frontend will run on: http://localhost:5173

Build for Production

npm run build
Preview Production Build

npm run preview
📂 Backend (Node + Express + Prisma + MySQL)
Setup

cd ../lessn_backend
npm install
Environment Variables
Create a .env file inside lessn_backend/ with:


DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
PORT=5000
👉 Replace USER, PASSWORD, and DATABASE_NAME with your MySQL credentials.

Prisma Setup

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (GUI for DB)
npm run prisma:studio
Run Backend Server

npm run dev
Backend will run on: http://localhost:5000

🔗 Connecting Frontend & Backend
Make sure backend is running first (npm run dev inside lessn_backend).

Update frontend API URLs (e.g., http://localhost:5000/api/...) inside lessn_frontend code wherever API calls are made.

📌 Tech Stack
Frontend

React 19

Vite

TailwindCSS

Backend

Node.js

Express.js

Prisma ORM

MySQL

🛠 Useful Commands
Frontend

cd lessn_frontend
npm install
npm run dev
Backend

cd lessn_backend
npm install
npm run dev
npm run prisma:migrate
npm run prisma:studio
🙌 Author
Muhammad Shoaib

GitHub: muhammadshoaib123456