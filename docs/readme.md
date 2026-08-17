# Distributed Real-Time Collaboration Platform

A cloud-native platform where multiple users can collaborate in real-time on documents, whiteboards, tasks, and code snippets. Built with a focus on modern software engineering practices, distributed systems architecture, and scalability.

## 🌟 Key Features

- **Real-Time Collaborative Editing:** Powered by Yjs CRDTs (Conflict-free Replicated Data Types) and WebSockets, ensuring seamless and conflict-free concurrent document editing.
- **User Presence & Live Cursors:** See exactly who is online and where they are editing in real-time.
- **Microservices Architecture:** Independently scalable backend services communicating via REST, WebSockets, and asynchronous Kafka events.
- **Role-Based Workspaces:** Organize documents into workspaces with Owner, Admin, Editor, and Viewer permissions.
- **Fast, Full-Text Search:** Continuous indexing into Elasticsearch for immediate searchability of documents.
- **Premium UI:** A beautifully crafted, dark-mode Next.js frontend featuring glassmorphism and smooth micro-animations.

---

## 🏗️ System Architecture

The platform is built as a monorepo utilizing npm workspaces and Docker Compose for orchestration.

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Editor:** TipTap (Headless rich text editor)
- **Real-Time Client:** `y-websocket` & `yjs`

### Backend Services
1. **User Service (Port 4001):** Handles JWT authentication and user profile management.
2. **Document Service (Port 4002):** Manages workspaces, document CRUD operations, and permission structures.
3. **Collaboration Service (Port 4003):** WebSocket server managing Yjs CRDTs, live cursors, and user presence (uses Redis pub/sub for horizontal scaling).
4. **Notification Service (Port 4004):** Event-driven service consuming Kafka events to generate user notifications.
5. **Search Service (Port 4005):** Consumes Kafka events to continuously index document changes into Elasticsearch.

### Infrastructure (Docker)
- **PostgreSQL 16:** Primary relational data store.
- **Redis 7:** Caching and WebSocket pub/sub.
- **Kafka & Zookeeper:** High-throughput message broker for inter-service communication.
- **Elasticsearch:** Fast text search engine.
- **MinIO:** S3-compatible object storage for future file attachments.
- **NGINX:** API Gateway routing requests to respective microservices.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Infrastructure:**
   This will spin up Postgres, Redis, Kafka, Elasticsearch, MinIO, and NGINX.
   ```bash
   docker compose up -d
   ```

3. **Start the Development Servers:**
   This command uses `concurrently` to boot up all 5 backend microservices and the Next.js frontend simultaneously.
   ```bash
   npm run dev:services
   ```

4. **Access the Platform:**
   - **Frontend UI:** Open your browser to [http://localhost:3000](http://localhost:3000)
   - **API Gateway:** Accessible at `http://localhost:8080`

---

## 🧪 Testing Collaboration Locally
To see the real-time features in action:
1. Open `http://localhost:3000` in your main browser window and register a new user.
2. Open `http://localhost:3000` in an Incognito/Private window and register a second user.
3. Create a workspace and document with User 1.
4. Open the same document with User 2 and start typing—you will see live cursors and instant syncing across both windows!

---
*Created by Divyansh Gupta*
