# Real Estate Portal - Frontend

React + Vite frontend application for the Real Estate Portal.

## Features

- User authentication (Login/Register)
- Property listing with cascading filters
- Property details and lead generation
- Service booking (Survey, Legal, Construction, Finance)
- Admin dashboards (Branch Admin & Super Admin)
- Real-time chat
- Responsive design

## Tech Stack

- React 18
- Vite
- Redux Toolkit (state management)
- Ant Design (UI components)
- React Router v6 (routing)
- Axios (HTTP client)
- Socket.io Client (real-time features)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your backend URL
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── layout/          # Layout components
├── pages/
│   ├── auth/            # Login, Register
│   ├── property/        # Property pages
│   ├── services/        # Service booking pages
│   ├── admin/           # Admin dashboards
│   └── chat/            # Chat interface
├── redux/
│   ├── slices/          # Redux slices
│   └── store.js         # Redux store
├── utils/
│   └── api.js           # Axios instance
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay key for payments
