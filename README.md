# Distributed Real-Time Collaboration Platform

A collaborative document editing platform built to explore distributed systems, real-time communication, and scalable backend architecture.

## Overview

This project aims to demonstrate the engineering concepts behind applications like Google Docs, Notion, and Slack by building a cloud-native collaboration platform from scratch.

The current repository contains the initial PostgreSQL database schema that will serve as the foundation for future development.

## Current Database Schema

### Users

Stores registered users.

| Column        | Description                |
| ------------- | -------------------------- |
| id            | Primary key                |
| username      | Unique username            |
| password_hash | Hashed password            |
| created_at    | Account creation timestamp |

### Documents

Stores collaborative documents.

| Column     | Description            |
| ---------- | ---------------------- |
| id         | Primary key            |
| title      | Document title         |
| content    | Document content       |
| owner_id   | Owner of the document  |
| created_at | Creation timestamp     |
| updated_at | Last updated timestamp |

### Document Collaborators

Manages document access permissions.

| Column      | Description          |
| ----------- | -------------------- |
| document_id | Referenced document  |
| user_id     | Referenced user      |
| role        | `viewer` or `editor` |

## Tech Stack

* PostgreSQL
* SQL

## Planned Features

* User authentication
* Document CRUD APIs
* Role-based access control
* Real-time collaborative editing
* WebSocket communication
* Version history
* Comments
* Notifications
* Search
* Offline synchronization
* Docker deployment
* Kubernetes support
* Monitoring and logging

## Project Status

🚧 Initial development

Current progress:

*  Database schema designed
*  Initial schema committed 

Next steps:

* Backend API
* Authentication
* Document management
* Real-time collaboration

## License

This project is intended for learning and portfolio purposes.
