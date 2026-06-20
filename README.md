# Keeply - Cloud Storage Platform

Keeply is a cloud storage platform inspired by Google Drive that allows users to securely manage files and folders with authentication, storage tracking, and trash management.

## 🚀 Features Completed

### Authentication System

* User registration
* User login
* JWT based authentication
* Protected routes
* Password hashing

### File Management System

* Upload files
* Store file metadata
* User based file access
* Storage limit validation
* Soft delete files
* Trash system
* Automatic trash cleanup
* Permanent file removal from storage

### Folder Management System

* Create folders
* Create nested folders
* Parent-child folder relationship
* Prevent duplicate folders inside same location
* Fetch folders by parent folder
* Open folder and fetch:

  * child folders
  * files inside folder
* Rename folders
* Recursive folder delete
* Move folders and all children to trash
* Delete files inside deleted folders

## 🗂 Folder Structure Logic

Example:

Projects

```
Projects
 └── Keeply
      └── Files
```

Deleting parent folder:

```
Delete Projects

↓ Recursive Delete

Projects → Trash
Keeply → Trash
Files → Trash
```

Trash cleaner permanently removes deleted data after retention period.

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* AWS S3 (storage integration)
* REST APIs

## Database Models

### User

* name
* email
* password
* storageLimit
* usedStorage
* plan

### File

* owner
* folder
* originalName
* fileName
* mimeType
* size
* s3Key
* isDeleted
* deletedAt

### Folder

* name
* owner
* parentFolder
* isDeleted
* deletedAt

## API Modules

### Auth Routes

* Register user
* Login user

### File Routes

* Upload file
* Get files
* Get single file
* Delete file

### Folder Routes

* Create folder
* Get folders
* Get folder content
* Rename folder
* Delete folder

## Current Status

Completed:

* Authentication
* File System
* Folder System

Upcoming:

* File move between folders
* File sharing
* Search functionality
* Frontend integration
* Deployment
