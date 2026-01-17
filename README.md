# 🍕 Full Stack Food Delivery Website

A food delivery platform built using the **MERN Stack** (MongoDB, Express, React, Node.js) integrated with **Stripe** for secure online payments. Includes authentication features, role-based access, cart management, order tracking, and more.


## 📦 Features

### 🍔 Customer Features
- Browse food items
- Add to cart
- Checkout with Stripe
- Order tracking
- Account registration/login
- Password reset & email verification

### 🛠 Admin Features
- Manage menu items (CRUD)
- View customer orders
- Role-based access (admin/user)

### 🔐 Authentication
- Secure JWT authentication
- Email verification
- Password reset via secure token
- Role-based protected routes

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcrypt, Nodemailer |
| **Payments** | Stripe API |
| **Deployment** | Docker, AWS/GCP/Azure |
| **Documentation** | Swagger/OpenAPI |

---

💻 Local Setup Instructions

Follow these steps to get the project running on your local machine. 🚀
🛠 1. Prerequisites

    🟢 Node.js: v14 or higher installed.

📥 2. Install Dependencies

You will need to install dependencies for the backend, frontend, and admin panel separately.

    📁 For Backend: 
            cd backend 
            npm install

    📁 For Frontend:  
            cd frontend
            npm install

    📁 For Admin: 
            cd admin 
            npm install

 🛠 3. Configure Environment Variables

    Copy the .env.example file and rename it to .env.
    Open the .env file and plug in your own MongoDB connection string and Stripe API keys.


⚡ 4. Running the Application

Open three separate terminals to run each service simultaneously. 📟

    📟 Terminal 1 (Backend): 
            cd backend 
            npm start

    📟 Terminal 2 (Frontend): 
            cd frontend 
            npm start

    📟 Terminal 3 (Admin): 
            cd admin 
            npm start

🌐 5. Accessing the Project

The application should now be running at the following local addresses:

    ✨ Frontend: http://localhost:5173

    ⚙️ Admin: http://localhost:5174

    🔌 Backend: http://localhost:4000