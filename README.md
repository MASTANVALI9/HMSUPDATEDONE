# MedCare Hospital - Digital System

A production-ready Hospital Marketing Website with integrated Backend API for appointment management.

## 🌟 Features

### Frontend (Hospital Website)
- **Home Page** - Hero section, stats, department preview, testimonials
- **About Us** - Hospital vision, mission, infrastructure
- **Specialities** - Medical departments and diseases treated
- **Doctors** - Doctor profiles with filtering and search
- **Appointment** - Online appointment booking form
- **Facilities** - Hospital infrastructure showcase
- **Contact** - Contact form with Google Maps

### Backend API
- **Authentication** - JWT-based registration and login
- **Doctors API** - List and filter doctors by department
- **Appointments API** - Book and manage appointments
- **Departments API** - List medical departments
- **Contact API** - Handle contact form submissions

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |

## 📁 Project Structure

```
HMS Website/
├── index.html              # Home page
├── about.html              # About page
├── specialities.html       # Medical specialities
├── doctors.html            # Doctors listing
├── appointment.html        # Appointment booking
├── facilities.html         # Hospital facilities
├── contact.html            # Contact page
├── css/
│   ├── main.css           # Design system & utilities
│   ├── components.css     # UI components
│   ├── animations.css     # Animations
│   └── pages.css          # Page-specific styles
├── js/
│   ├── main.js            # Core functionality
│   ├── doctors.js         # Doctors page logic
│   └── appointment.js     # Appointment form
└── backend/
    ├── server.js          # Express server
    ├── package.json       # Dependencies
    ├── .env.example       # Environment template
    ├── config/
    │   └── db.js          # Database connection
    ├── middleware/
    │   └── auth.js        # JWT middleware
    ├── routes/
    │   ├── auth.js        # Authentication
    │   ├── doctors.js     # Doctors API
    │   ├── appointments.js # Appointments API
    │   ├── departments.js # Departments API
    │   └── contact.js     # Contact API
    └── db/
        └── schema.sql     # Database schema
```

## 🚀 Quick Start

### Frontend Only (No Backend Required)
Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 5500

# Using Node.js (npx)
npx serve .
```

### Full Setup with Backend

#### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials

# Initialize database (run schema.sql in PostgreSQL)
psql -U postgres -d medcare_hospital -f db/schema.sql

# Start server
npm run dev
```

#### 3. Environment Variables

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medcare_hospital
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-secret-key
PORT=3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors?department=x` | Filter by department |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/departments` | List departments |
| POST | `/api/contact` | Submit contact form |

## 🌐 Deployment

### Frontend
Deploy to **Netlify** or **Vercel**:
- Connect your repository
- Set build directory to root
- Deploy!

### Backend
Deploy to **Render** or **Railway**:
1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## ⚠️ Disclaimer

This is a **demo website** created for educational and portfolio purposes only. Medical information presented is for demonstration and should not be used for actual medical decisions.

## 📄 License

MIT License - Feel free to use for your projects!

---

Built with ❤️ for healthcare
# HMSUPDATEDONE
