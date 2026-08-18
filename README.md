# Distributed Real-Time Collaboration Platform

A cloud-native, distributed real-time collaboration platform designed for teams to edit documents, share workspaces, and track presence concurrently. Built from the ground up with a focus on modern software engineering practices, Event-Driven microservices, and high scalability.

---

## 🚀 Features

- **Real-Time Collaborative Editing:** Powered by **Yjs** (CRDTs - Conflict-free Replicated Data Types) and WebSockets, ensuring seamless, conflict-free document editing across multiple clients regardless of network latency.
- **User Presence & Live Cursors:** See exactly who is online and where they are editing in real-time.
- **Role-Based Access Control (RBAC):** Granular permissions for Workspaces (Owner, Admin, Editor, Viewer).
- **Event-Driven Notifications:** Asynchronous, non-blocking notification generation utilizing **Kafka** message queues.
- **Fast, Full-Text Search:** Continuous indexing into **Elasticsearch** for immediate, low-latency document searching.
- **Premium User Interface:** A dark-mode, glassmorphic UI built with **Next.js 14**, **TailwindCSS**, and **TipTap**.
- **Monorepo Architecture:** Clean codebase utilizing `npm workspaces` for shared types and interfaces across all microservices and the frontend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS (Custom Glassmorphism Design System)
- **State Management:** Zustand
- **Rich Text Editor:** TipTap (Headless, highly extensible editor)
- **Real-Time Client:** `y-websocket` & `yjs`

### Backend Services (Node.js & TypeScript)
- **API Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Real-Time Server:** `y-websocket` (custom server implementation with awareness and CRDT state syncing)
- **Inter-Service Communication:** Apache Kafka (KafkaJS)

### Infrastructure & Data Stores
- **Primary Database:** PostgreSQL 16 (Relational data, user profiles, document metadata)
- **Caching & Pub/Sub:** Redis 7 (Scaling WebSocket presence across multiple instances)
- **Message Broker:** Apache Kafka & Zookeeper (Event streaming)
- **Search Engine:** Elasticsearch (Full-text search indexing)
- **Object Storage:** MinIO (S3-compatible storage for file attachments)
- **API Gateway:** NGINX (Reverse proxying and routing requests to appropriate microservices)
- **Orchestration:** Docker & Docker Compose

---

## 📐 System Architecture

The platform follows an Event-Driven Microservices architecture. 

1. **User Service (`port 4001`):** Handles authentication, registration, and user profile management.
2. **Document Service (`port 4002`):** Manages the core business logic for workspaces and documents. When a document is created or modified, it publishes `document-events` to Kafka.
3. **Collaboration Service (`port 4003`):** The real-time engine. Upgrades HTTP connections to WebSockets. Manages binary Yjs CRDT updates and broadcasts presence/cursors. Uses Redis Pub/Sub to sync state if scaled horizontally.
4. **Notification Service (`port 4004`):** A background service that consumes Kafka events (e.g., `user_joined`, `document_shared`) and generates notifications.
5. **Search Service (`port 4005`):** Consumes Kafka `document-events` to continuously update the Elasticsearch index, keeping search results highly accurate and fast.
6. **API Gateway (NGINX on `port 8080`):** Acts as the single entry point for the frontend, routing `/api/users` to the User Service, `/api/docs` to the Document Service, etc., while natively supporting WebSocket upgrades for `/api/collab`.

---

## 📂 File Structure

```text
collaboration_systems/
├── frontend/
│   └── web/                        # Next.js 14 Frontend Application
│       ├── src/
│       │   ├── app/                # Next.js App Router (Pages & Layouts)
│       │   ├── components/         # Reusable UI Components (Editor, Sidebar, Avatar)
│       │   └── store/              # Zustand state stores
├── services/                       # Backend Microservices
│   ├── user-service/               # Authentication & User Profiles
│   ├── document-service/           # Workspace & Document CRUD
│   ├── collaboration-service/      # WebSocket server for Yjs CRDTs
│   ├── notification-service/       # Kafka consumer for notifications
│   └── search-service/             # Elasticsearch indexing via Kafka
├── packages/
│   └── shared/                     # Shared TypeScript interfaces & DTOs
├── infra/                          # Infrastructure Configurations
│   ├── nginx/                      # NGINX API Gateway config
│   └── postgres/                   # SQL Initialization Scripts
├── docs/                           # Sphinx Documentation source
├── docker-compose.yml              # Local infrastructure orchestration
└── package.json                    # Root monorepo configuration
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/collaboration-app.git
   cd collaboration-app
   ```

2. **Install all dependencies:**
   *(This utilizes npm workspaces to install dependencies for all sub-projects concurrently).*
   ```bash
   npm install
   ```

3. **Start the Infrastructure (Docker):**
   This spins up Postgres, Redis, Kafka, Elasticsearch, MinIO, and NGINX in the background.
   ```bash
   docker compose up -d
   ```

4. **Start the Development Servers:**
   This command boots up all 5 backend microservices and the Next.js frontend simultaneously using `concurrently`.
   ```bash
   npm run dev:services
   ```

5. **Access the Platform:**
   - **Frontend UI:** Open [http://localhost:3000](http://localhost:3000)
   - **API Gateway:** `http://localhost:8080`

---

## 🧪 Testing Real-Time Collaboration

To see the CRDT synchronization and live presence features in action locally:
1. Open `http://localhost:3000` in your main browser window and register a new user.
2. Open `http://localhost:3000` in a completely separate Incognito/Private window (or a different browser) and register a second user.
3. Create a workspace and a new document using User 1.
4. Navigate to that same document with User 2.
5. Start typing! You will see live cursors, names, and instant text synchronization across both windows with near-zero latency.

---
*Documentation built with Sphinx. For full developer documentation, visit the [GitHub Pages](https://your-username.github.io/your-repo-name) site.*
