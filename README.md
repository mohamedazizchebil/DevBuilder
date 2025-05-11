🧱 <h1>DevBuilder</h1>  
Microservices Architecture | REST | GraphQL | gRPC | Kafka | Docker

A modular backend code generation platform that scaffolds project structures in Go, Python (Flask), and Node.js (Express). DevBuilder uses a microservices architecture and integrates REST, GraphQL, gRPC, and Kafka to provide a scalable and extensible development automation tool.

---

## 📚 Table of Contents
- 🚀 Purpose
- 🧩 Microservices Overview
- 🛠️ Technologies Used
- 🐳 Docker & Setup
- 🏗️ Architecture Overview
- 🎯 Innovation Highlights
- 🌱 Future Enhancements
- 📦 Dependencies & Installation
- 🧪 Testing Guide
- 📁 .gitignore
- 📌 Final Notes

---

## 🚀 Purpose
DevBuilder aims to accelerate backend development by automatically generating project scaffolds tailored to a developer's stack preferences. It supports Go, Python (Flask), and Node.js (Express) and allows enabling optional features like database integration, authentication, and Docker setup.

---

## 🧩 Microservices Overview
| Service               | Role                                                                 |
|-----------------------|----------------------------------------------------------------------|
| 🚪 API Gateway         | Exposes REST and GraphQL endpoints. Communicates with backend services |
| ⚙️ GenerationService   | Builds the project structure based on user input                      |
| 🔍 ValidationService   | Validates configuration before generation                             |
| 📦 ZipService          | Compresses generated project into ZIP archive                         |
| 💾 StorageService      | Stores ZIP files locally or on cloud storage                          |
| 📣 NotificationService | Publishes generation notifications via Kafka                          |

---

## 🛠️ Technologies Used
| Technology      | Role                                                           |
|-----------------|----------------------------------------------------------------|
| REST            | Primary interface exposed through API Gateway                 |
| GraphQL         | Alternative interface for custom queries & flexibility        |
| gRPC            | Internal communication between services (faster + type-safe)  |
| Kafka           | Asynchronous messaging (events between services)              |
| Docker          | Containerization for consistency across environments          |
| Docker Compose  | Local multi-service orchestration                             |

---

## 🐳 Docker & Setup
### Why Docker?
- Isolates services for easy development  
- Simplifies environment setup  
- Reproducible builds

### 🔧 Common Commands
```bash
# Build and run all services:
docker-compose up --build

# Stop all services and remove volumes:
docker-compose down -v

# View logs of a specific service:
docker logs -f devbuilder-generation-service-1

# Access Kafka container:
docker exec -it devbuilder-kafka bash

# List Kafka topics:
kafka-topics.sh --bootstrap-server kafka:9092 --list
```

---

## 🏗️ Architecture Overview
```text
User
  ↓ (REST/GraphQL)
API Gateway
  ↓ (gRPC)
ValidationService
  ↓ (gRPC)
GenerationService
  ↓ (gRPC)
ZipService
  ↓ (gRPC)
StorageService
  ↓ (Kafka event)
NotificationService
```

---

## 🎯 Innovation Highlights
- Combines REST, GraphQL, gRPC, and Kafka in a single system  
- Modular: each service is independently scalable and testable  
- Pluggable architecture for adding more frameworks, databases, etc.  
- Can be integrated in a CI/CD pipeline for automated backend scaffolding

---

## 🌱 Future Enhancements
- Add support for frontend stacks (React, Vue)  
- Integrate cloud storage options (e.g., S3, Google Drive)  
- User authentication with JWT & RBAC  
- Extend Kafka for error logging (Dead Letter Queues)  
- Real-time generation progress via WebSocket or SSE

---

## 📦 Dependencies & Installation
### API Gateway:
```bash
npm install express kafkajs apollo-server-express graphql
```

### GenerationService:
```bash
npm install grpc @grpc/proto-loader fs-extra
```

### ZipService:
```bash
npm install archiver grpc @grpc/proto-loader
```

### NotificationService:
```bash
npm install kafkajs
```

### StorageService:
```bash
npm install grpc @grpc/proto-loader fs-extra
```

---

## 🧪 Testing Guide
### REST:
```bash
curl -X POST http://localhost:3000/generate \
-H "Content-Type: application/json" \
-d '{"language":"go","framework":"gin","projectName":"my-app"}'
```

### GraphQL:
```graphql
mutation {
  generateProject(
    input: {
      projectName: "test-project"
      language: "python"
      framework: "flask"
    }
  ) {
    status
    message
  }
}
```

---

## 📁 .gitignore
```
node_modules/
.env
dist/
*.log
.DS_Store
coverage/
*.local
*.test.js
*.out
docker-data/
zips/
generated-projects/
```

---

## 📌 Final Notes
DevBuilder serves as a powerful tool for backend automation. Its microservices architecture ensures clean separation of concerns and scalability. Ideal for teams, bootstrappers, and anyone looking to rapidly prototype reliable backends.

Contributions are welcome. Fork the repo and customize your own builder!

© 2025 DevBuilder Project
