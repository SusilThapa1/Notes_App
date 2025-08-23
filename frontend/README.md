 
# Notes App

A full-featured Notes App where users can create and manage programmes and semesters, and upload notes, questions, or syllabus using Google Drive links. The app supports user and admin roles with secure authentication and role-based access.

## Features

- **Programmes & Semesters:** Add, edit, and manage programmes and semesters.
- **Notes Management:** Upload notes, questions, or syllabus via Google Drive links.
- **Role-Based Access:**
    - **Admin:** Access to admin dashboard, can view, edit, and delete programmes and semesters (cannot delete users).
    - **User:** Access to user dashboard, can manage their own notes and profile.
- **Authentication:**
    - Secure login/signup for users and admins.
    - Passwords hashed with bcrypt.
    - JWT-based authentication.
    - OTP verification via email (NodeMailer) during signup and password reset.
- **Profile Management:** Users and admins can upload or edit their profile.
- **Account Management:** Users can delete their account, change password, or reset password via email OTP.
- **Reviews:** Users can send reviews.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** bcrypt, JWT
- **Email Service:** NodeMailer (for OTP verification)
- **Environment Variables:** Managed via `.env` file

## Example `.env` File

```env
MONGO_URI="mongodb://127.0.0.1:27017/study_site"
PORT=5000
SERVER_BASE_URL=http://localhost:5001
Jwt_Secret_Key="your_jwt_secret_key"
NODE_ENV="development"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_pass"
SENDER_EMAIL="your_sender_email@example.com"
```

---

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up your `.env` file as shown above.
4. Run the backend and frontend servers.
5. Access the app in your browser.

---

## License

This project is for educational purposes.