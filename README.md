# Keeply ☁️
# Keeply ☁️

![Progress](https://img.shields.io/badge/Progress-Backend%20Complete-green)
![Frontend](https://img.shields.io/badge/Frontend-In%20Progress-yellow)
![Status](https://img.shields.io/badge/Status-Active-blue)


Keeply is a secure full-stack cloud storage platform inspired by Google Drive.  
It allows users to upload, organize, share, and manage files using secure authentication, AWS S3 private storage, and scalable backend architecture.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Based Authentication
- Protected APIs
- Persistent Login Sessions
- React Context Based Authentication State
- Public & Private Route Protection
- Secure Logout Flow

---

### 👤 User Profile
- Dynamic User Profile
- User Information Management
- Current Plan Display
- Storage Usage Display
- Profile Dropdown
- Authentication Based UI Updates

---

### 📊 Dashboard
- Real User Dashboard
- Storage Overview
- Total Files Count
- Total Folders Count
- User Storage Tracking
- Current Plan Information
- Protected Dashboard Statistics API

---

### ☁️ Cloud Storage
- AWS S3 Private Bucket Integration
- Secure File Upload using Presigned URLs
- Direct Client to S3 Upload Flow
- Secure File Download using Temporary URLs
- File Metadata Management

---

### 📁 File Management
- Upload Files
- Get All User Files
- Get Single File
- Delete Files
- Storage Usage Tracking
- User Storage Limit Validation

---

### 📂 Folder Management
- Create Folders
- Nested Folder Structure
- Parent-Child Folder Relationship
- Get Folder Contents
- Folder Based File Organization
- Recursive Folder Delete

---

### 🔗 File Sharing
- Generate Secure Share Links
- Random Crypto Token Based Sharing
- Public File Access Using Share Token
- Duplicate Share Link Prevention
- Secure Temporary Download URLs

---

### 🔍 Search
- Search Files
- Search Folders
- User Specific Search Results
- Case Insensitive Search
- Partial Name Matching

---

### 🗑 Trash System
- Soft Delete Support
- Trash Based File Removal
- Automatic Cleanup using Cron Job
- Permanent AWS S3 Object Deletion

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API
- Axios
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

### Cloud Storage
- AWS S3
- AWS SDK v3
- Presigned URLs

### Tools
- Node Cron
- Dotenv
- Git

---

## 📁 Project Structure

```bash
Keeply/

├── client/
│
│   ├── src/
│   │
│   ├── api/
│   │   └── Axios Client
│   │
│   ├── components/
│   │   ├── Dashboard Components
│   │   ├── Profile Menu
│   │   └── UI Components
│   │
│   ├── context/
│   │   └── Auth Context
│   │
│   ├── routes/
│   │   ├── Protected Routes
│   │   └── Public Routes
│   │
│   ├── services/
│   │   ├── Auth Service
│   │   └── Dashboard Service
│   │
│   └── App.jsx
│


├── server/
│
├── config/
│   └── AWS S3 Configuration

├── controllers/
│   ├── Auth Controller
│   ├── Dashboard Controller
│   ├── File Controller
│   ├── Folder Controller
│   ├── Share Controller
│   └── Search Controller

├── middleware/
│   └── Authentication Middleware

├── models/
│   ├── User Model
│   ├── File Model
│   ├── Folder Model
│   └── Share Model

├── routes/
│   ├── Auth Routes
│   ├── Dashboard Routes
│   ├── File Routes
│   ├── Folder Routes
│   ├── Share Routes
│   └── Search Routes

├── utils/
│   ├── S3 Utilities
│   └── Trash Cleaner

├── server.js
└── package.json
```

---

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=

MONGO_URI=

JWT_SECRET=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_BUCKET_NAME=

FRONTEND_URL=
```

---

## 📤 Upload Flow

```text
User Selects File

        ↓

Request Presigned Upload URL

        ↓

Backend Authentication

        ↓

Validate Storage Limit

        ↓

Generate AWS Presigned URL

        ↓

Client Uploads Directly To S3

        ↓

Save File Metadata In MongoDB

        ↓

Update User Storage
```

---

## 📥 Download Flow

```text
User Requests File

        ↓

Validate Ownership

        ↓

Fetch s3Key From Database

        ↓

Generate Temporary AWS URL

        ↓

Download File Securely
```

---

## 🔗 Share Flow

```text
User Creates Share Link

        ↓

Generate Secure Token

        ↓

Save Token With File Reference

        ↓

Public User Opens Link

        ↓

Generate Temporary Download URL

        ↓

Access Shared File
```

---

## 🗑 Delete Flow

```text
Delete Request

        ↓

Move File / Folder To Trash

        ↓

Cron Job Cleanup

        ↓

Delete From AWS S3

        ↓

Remove Metadata
```

---

## Current Status

### Completed ✅

- Backend Architecture
- Authentication System
- JWT Authorization
- Frontend UI Setup
- Axios API Layer
- Auth Context Integration
- Protected Routing
- Dynamic User Profile
- Dashboard Statistics API
- Real Dashboard Overview


### In Progress 🚧

- Nested Folder Integration
- File Listing Integration
- AWS S3 Upload Connection


### Upcoming 🚀

- Payment Gateway
- Subscription Plans
- Deployment
- Advanced Sharing

---

## Status

Full Stack Integration In Progress 🚀

Core Authentication & Dashboard Engine Completed ✅