# Keeply ☁️

Keeply is a cloud storage platform inspired by Google Drive.
It allows users to securely upload, store, organize, download, and manage files using AWS S3 private storage.

## 🚀 Features

### Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Based Authentication
* Protected APIs

### Cloud Storage

* AWS S3 Private Bucket Integration
* Secure File Upload using Presigned URLs
* Direct Client to S3 Upload Flow
* Secure File Download using Temporary URLs
* File Metadata Management

### File Management

* Upload Files
* Get User Files
* Get Single File
* Delete Files
* Storage Usage Tracking
* User Storage Limit Validation
* Folder Based File Organization

### Folder Management

* Create Root Folders
* Create Nested Folders
* Parent-Child Folder Structure
* Prevent Duplicate Folder Creation
* Get Folder Contents

  * Child Folders
  * Files
* Rename Folders
* Recursive Folder Delete
* Move Folder Tree To Trash

### Trash System

* Soft Delete Support
* Trash Based File & Folder Removal
* Recursive Folder Cleanup
* Automatic Cleanup using Cron Job
* Permanent AWS S3 Object Deletion

---

## 🛠 Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Authentication**

* JWT
* bcrypt

**Cloud**

* AWS S3
* AWS SDK v3
* Presigned URLs

**Tools**

* Node Cron
* Dotenv

---

## 📁 Project Structure

```bash
server/

├── config/
│   └── s3 configuration

├── controllers/
│   ├── auth controller
│   ├── file controller
│   └── folder controller

├── middleware/
│   └── authentication middleware

├── models/
│   ├── User Model
│   ├── File Model
│   └── Folder Model

├── routes/
│   ├── auth routes
│   ├── file routes
│   └── folder routes

├── utils/
│   ├── S3 utilities
│   └── Trash cleaner

├── server.js
└── package.json
```

---

## 🔐 Environment Variables

Create a `.env` file using `.env.example`

```env
PORT=

MONGO_URI=

JWT_SECRET=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_BUCKET_NAME=
```

---

## 📤 Upload Flow

```text
User Request

 ↓

Backend Authentication

 ↓

Generate Presigned Upload URL

 ↓

Client Uploads File Directly To S3

 ↓

Save File Metadata In MongoDB
```

---

## 📁 Folder Delete Flow

```text
User Deletes Folder

 ↓

Find Child Folders Recursively

 ↓

Move Child Folders To Trash

 ↓

Move Files Inside Folders To Trash

 ↓

Trash Cleanup Removes Data Permanently
```

---

## 🗑 Trash Cleanup Flow

```text
Deleted File / Folder

 ↓

Retention Period Ends

 ↓

Cron Job Runs

 ↓

Delete File From AWS S3

 ↓

Remove Metadata From MongoDB
```

---

## Upcoming Features

* File Sharing
* Search Functionality
* Subscription Plans
* Frontend Dashboard
* Deployment

---

## Status

Backend Storage Engine Completed ✅
Folder Management System Completed ✅
