JW-Studio Management System 

This is a full-stack MERN application built using:

Frontend: React + Vite

Backend: Node.js + Express

Database: MongoDB

Authentication: JWT

Email Service: Gmail SMTP

Payments: Stripe

AI Integration: Google Gemini API

Installation & Running the Project
1️⃣ Clone the Repository

git clone https://github.com/theshanGeeth123/MERN-Y2S2-PROJECT.git
cd MERN-Y2S2-PROJECT

2️⃣ Install Backend Dependencies

cd server
npm install

Start Backend ->
npm run dev
# or
node server.js

Server will run on:http://localhost:4000

3️⃣ Install Frontend Dependencies

cd client
npm install

Start Frontend -> 
npm run dev

Frontend will run on:http://localhost:5173


Create a file named .env inside the server folder.

# Server Configuration
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (SMTP - Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SENDER_EMAIL=your_email@gmail.com

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key


Create a file named .env inside the client folder.


# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# Google Gemini API
VITE_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
VITE_GEMINI_API_KEY=your_gemini_api_key

# ClipDrop API
VITE_CLIPDROP_API_KEY=your_clipdrop_api_key









Create a file named .env inside the client folder.
