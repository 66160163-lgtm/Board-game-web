
# Doodle Boardgame Cafe

เว็บจองโต๊ะและสั่งอาหารสำหรับ Doodle Boardgame Cafe คาเฟ่บอร์ดเกม บางแสน ชลบุรี

## Features

- จองโต๊ะออนไลน์ พร้อมเลือกวัน เวลา จำนวนคน
- สั่งอาหารและเครื่องดื่มล่วงหน้าพร้อมการจอง
- สมัครสมาชิก / เข้าสู่ระบบ
- ดูประวัติการจองของตัวเอง
- Admin Panel สำหรับจัดการการจองทั้งหมด
- Carousel แสดงบอร์ดเกมกว่า 300+ เกม

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| UI Components | Radix UI, Lucide React, Sonner |
| Backend | Express.js, Node.js |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Deployment | Vercel (Frontend + Backend), Supabase |

## Project Structure

```
├── frontend/          # React frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   └── components/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/game/   # Board game images
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express API
│   ├── index.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิดที่ http://localhost:5173

### Backend

```bash
cd backend
npm install

# ตั้ง environment variables
# SUPABASE_URL=<your-supabase-url>
# SUPABASE_KEY=<your-supabase-service-role-key>

node index.js
```

รันที่ port 3001

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Vercel (Serverless / Node.js) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |

## Environment Variables

### Frontend (`frontend/.env`)

```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<supabase-anon-key>
```

### Backend (`backend/.env`)

```
SUPABASE_URL=<supabase-url>
SUPABASE_KEY=<supabase-service-role-key>
```

## Database (Supabase)

### Tables

- **bookings** — ข้อมูลการจอง (customer_name, phone, booking_date, booking_time, hours, guests, table_name, user_id, menu_orders)
- **profiles** — โปรไฟล์ผู้ใช้ (id, email, role: 'user' | 'admin')

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/bookings` | สร้างการจอง |
| GET | `/api/bookings` | ดูการจองทั้งหมด |
| POST | `/api/auth/signup` | สมัครสมาชิก (admin API) |

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.