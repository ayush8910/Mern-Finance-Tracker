# MERN Finance Tracker

A complete Finance Tracker built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It includes user authentication with OTP, profile management, income/expense tracking, filtering, sorting, and pagination.

---

## 📌 Features

### 🔐 Authentication
- Signup & Login using JWT  
- Email-based OTP verification  
- Secure password hashing  

### 💸 Transactions
- Add Income and Expense  
- Recent Transactions list  
- Filters by date, type, amount  
- Sorting by amount/date/type  
- Server-side pagination for performance  

### 👤 Profile
- View and update user profile  
- Email update with OTP verification  

### 🛠 Tech Stack
- **Frontend:** React, Axios, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT + OTP Email  

---

## 🚀 Running the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ayush8910/Mern-Finance-Tracker.git
cd Mern-Finance-Tracker
```

---

## 2️⃣ Setup Backend (Server)
```bash
cd server
npm install
cp .env.example .env
```

Now open `server/.env` and fill with **your real values**:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

Run server:
```bash
npm start
```

Server runs on:  
👉 http://localhost:5000

---

## 3️⃣ Setup Frontend (Client)
```bash
cd ../client
npm install
cp .env.example .env
```

Now open `client/.env` and add:

```
REACT_APP_API_URL=http://localhost:5000
```

Run client:
```bash
npm start
```

Client runs on:  
👉 http://localhost:3000

---

## 📁 Folder Structure
```
root
 ├── client/      # React Frontend
 ├── server/      # Express Backend
 ├── README.md
 └── ...
```

---


