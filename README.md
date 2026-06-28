# Keeply ☁️

![Version](https://img.shields.io/badge/Version-v1.0-success)
![Frontend](https://img.shields.io/badge/Frontend-Complete-brightgreen)
![Backend](https://img.shields.io/badge/Backend-Complete-brightgreen)
![Status](https://img.shields.io/badge/Status-Ready%20for%20Deployment-blue)

Keeply is a secure full-stack cloud storage platform inspired by Google Drive.

It allows users to securely upload, organize, search, share, restore, and permanently delete files using secure authentication, AWS S3 private storage, and scalable MERN architecture.

---

# 🚀 Features

## 🔐 Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Based Authentication
* Protected APIs
* Persistent Login Sessions
* React Context Authentication
* Public & Private Route Protection
* Secure Logout Flow

---

## 👤 User Profile

* Dynamic User Profile
* Current Plan Display
* Storage Usage Display
* Storage Percentage
* Profile Dropdown
* Authentication Based UI

---

## 📊 Dashboard

* Real User Dashboard
* Storage Overview
* Total Files Count
* Total Folders Count
* User Storage Tracking
* Current Plan Information
* Dashboard Statistics API
* Responsive Dashboard

---

## ☁️ Cloud Storage

* AWS S3 Private Bucket
* Secure File Upload using Presigned URLs
* Direct Client → AWS S3 Upload
* Secure Temporary Download URLs
* Secure File Open
* File Metadata Management
* 100 MB Free Storage Limit

---

## 📁 File Management

* Upload Files
* Open Files
* Download Files
* Rename Files
* Delete Files
* Permanent Delete
* Storage Usage Tracking
* Storage Limit Validation

---

## 📂 Folder Management

* Create Folder
* Rename Folder
* Delete Folder
* Nested Folder Structure
* Parent–Child Folder Relationship
* Recursive Folder Restore
* Recursive Folder Delete

---

## 🔗 File Sharing

* Secure Share Links
* Crypto Token Based Sharing
* Duplicate Share Link Prevention
* Public File Access
* Temporary Download URLs

---

## 🔍 Search

* Search Files
* Search Folders
* User Specific Results
* Case Insensitive Search
* Partial Name Matching

---

## 🗑 Trash System

* Soft Delete
* Restore Files
* Restore Folders
* Recursive Restore
* Permanent Delete
* Empty Trash
* Automatic Cleanup using Cron Job
* Permanent AWS S3 Object Deletion

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router DOM
* Context API
* Axios
* Tailwind CSS
* Framer Motion
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT
* bcrypt

## Cloud

* AWS S3
* AWS SDK v3
* Presigned URLs

## Utilities

* Node Cron
* Dotenv
* Crypto
* Git

---

# 📁 Project Structure

```bash
Keeply/

├── client/
│
│   ├── src/
│   │
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── App.jsx
│
├── server/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── cron/
│   ├── server.js
│   └── package.json
```

---

# 🔐 Environment Variables

Create a `.env` file

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

# 📤 Upload Flow

```text
User Selects File

        ↓

Authenticate User

        ↓

Validate Storage Limit

        ↓

Generate Presigned Upload URL

        ↓

Client Uploads Directly To AWS S3

        ↓

Store File Metadata

        ↓

Update User Storage
```

---

# 📥 Download Flow

```text
User Requests File

        ↓

Validate Ownership

        ↓

Fetch s3Key

        ↓

Generate Temporary AWS URL

        ↓

Download / Open File
```

---

# 🔗 Share Flow

```text
User Generates Share Link

        ↓

Generate Secure Token

        ↓

Store Share Metadata

        ↓

Public User Opens Link

        ↓

Generate Temporary Download URL

        ↓

Access Shared File
```

---

# 🗑 Trash Flow

```text
Delete Request

        ↓

Move File / Folder To Trash

        ↓

Restore

        OR

Permanent Delete

        ↓

Delete From AWS S3

        ↓

Remove MongoDB Metadata
```

---

# 📦 Current Status

## ✅ Completed

* Authentication System
* JWT Authorization
* AWS S3 Integration
* File Upload
* File Download
* File Open
* File Sharing
* Folder Management
* Nested Folders
* Search System
* Trash System
* Recursive Delete
* Recursive Restore
* Empty Trash
* Storage Tracking
* 100 MB Free Plan
* Responsive UI
* Pricing Page
* Dashboard
* Landing Page

---

## 🚀 Upcoming (V2)

* Razorpay Subscription
* Premium Plans
* Email Notifications
* Team Collaboration
* Folder Sharing
* File Version History
* File Preview Improvements

---

# 👨‍💻 Developer

**Prakhar Shukla**

Full Stack MERN Developer

Built with ❤️ using React, Node.js, MongoDB and AWS S3.

---

# ⭐ Status

**Keeply V1 is feature complete and ready for deployment.**
