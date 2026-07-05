# Collaborative Document Editing System

A cloud-native collaborative document editing platform inspired by applications like Google Docs. This project is being developed incrementally with a focus on backend engineering, distributed systems, and DevOps best practices.

## Project Goals

The primary objective of this project is to gain hands-on experience in designing and implementing a scalable collaboration platform while learning industry-standard technologies such as:

* FastAPI
* PostgreSQL
* JWT Authentication
* WebSockets
* Redis Pub/Sub
* Docker & Docker Compose
* Kafka
* Elasticsearch
* AWS S3 (or MinIO)
* Microservices Architecture

---

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT Authentication
* Passlib (Password Hashing)

### Database

* PostgreSQL 15 (Docker)

### Development Tools

* Docker
* Docker Compose
* Git

### Planned Technologies

* React / Next.js
* Redis
* Kafka
* Elasticsearch
* MinIO / AWS S3
* NGINX API Gateway

---

# Project Structure

```
collaboration-system/

├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env
│
├── database/
│   └── schema.sql
│
├── frontend/
│
├── docker-compose.yml
│
└── README.md
```

---

# Current Features (Phase 1 Completed)

## Infrastructure

* Dockerized PostgreSQL database
* Docker Compose setup
* Persistent database storage using Docker volumes
* Git repository initialized

---

## Authentication

* User registration
* Secure password hashing
* User login
* JWT-based authentication
* Protected API endpoints

---

## Database

Designed and implemented the following schema:

* Users
* Documents
* Document Collaborators

Features include:

* Document ownership
* Role-based permissions
* Viewer/Editor access control

---

## Document Management

Implemented REST APIs for:

* Create Document
* Read Document
* Update Document
* Delete Document
* Share Document
* Permission validation

---

## Backend Architecture

Organized using a modular structure:

* Routers
* Services
* Models
* Schemas
* Utility functions
* Configuration management

---

## API Documentation

FastAPI automatically generates interactive API documentation.

Available at:

```
http://localhost:8000/docs
```

---

# Completed Milestones

* [x] Initialize Git repository
* [x] Configure Docker environment
* [x] Deploy PostgreSQL using Docker Compose
* [x] Design relational database schema
* [x] Configure FastAPI project
* [x] Connect FastAPI to PostgreSQL
* [x] Implement SQLAlchemy models
* [x] User registration
* [x] User login
* [x] Password hashing
* [x] JWT authentication
* [x] Protected routes
* [x] Document CRUD APIs
* [x] Role-based document permissions

---

# Upcoming Development Roadmap

## Phase 2 — Real-Time Collaboration

### WebSockets

* Establish persistent client connections
* Real-time communication
* Multi-user document editing

### Collaboration Engine

* Document rooms
* Live cursor updates
* Broadcast document changes

### Conflict Resolution

* Integrate CRDT library (Yjs)
* Handle concurrent edits safely
* Synchronize document state across clients

### Redis Pub/Sub

* Synchronize updates across multiple backend instances
* Support horizontal scaling

---

## Phase 3 — Cloud-Native Architecture

* Dockerize backend services
* Dockerize frontend
* Introduce API Gateway (NGINX)
* Multi-container Docker Compose setup
* Separate services where appropriate
* Improve deployment workflow

---

## Phase 4 — Platform Expansion

### Notifications

* Kafka event streaming
* Notification service
* Email and in-app notifications

### Search

* Elasticsearch integration
* Full-text document search

### File Storage

* AWS S3 or MinIO
* Image uploads
* File attachments

---

# Long-Term Vision

Transform the application from a traditional CRUD system into a scalable, production-inspired collaboration platform featuring:

* Real-time collaborative editing
* Distributed architecture
* Event-driven communication
* Search indexing
* Cloud-native deployment
* Horizontal scalability

---

# Learning Objectives

This project is intended to strengthen practical experience in:

* Backend API development
* Database design
* Authentication & authorization
* Distributed systems
* Real-time communication
* DevOps practices
* Containerization
* Event-driven architectures
* System design
* Microservices

---

# Current Status

**Phase 1:** ✅ Completed

The backend supports authentication, document management, and role-based access control using FastAPI and PostgreSQL.

**Next Milestone:** Implement real-time collaborative editing using WebSockets as the foundation for the collaboration engine.

---

## Author
**Divyansh Gupta**
