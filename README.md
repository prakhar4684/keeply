# Keeply ☁️

Keeply is a secure cloud storage platform inspired by Google Drive.  
It allows users to upload, organize, share, and manage files using AWS S3 private storage with secure backend architecture.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Based Authentication
- Protected APIs

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

---

## 📁 Project Structure

```bash
server/

├── config/
│   └── AWS S3 Configuration

├── controllers/
│   ├── Auth Controller
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

Backend Authentication

        ↓

Generate AWS Presigned Upload URL

        ↓

Client Uploads File Directly To S3

        ↓

Save File Metadata In MongoDB
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

## Upcoming Features

- Frontend Integration
- Payment Gateway
- Subscription Plans
- Deployment

---

## Status

Backend V1 Completed ✅

Core Storage Engine Completed 🚀
