 <h1>🧱 DevBuilder</h1>  
Microservices Architecture | REST | GraphQL | gRPC 

A modular backend code generation platform that scaffolds project structures in Go, Python (Flask), and Node.js (Express). DevBuilder uses a microservices architecture and integrates REST, GraphQL, gRPC to provide a scalable and extensible development automation tool.

---

## 📚 Table of Contents
- 🚀 Purpose
- 🧩 Microservices Overview
- 🛠️ Technologies Used
- 🏗️ Architecture Overview
- 🎯 Innovation Highlights
- 📦 Dependencies & Installation
- 🧪 Testing Guide
- 📁 .gitignore
- 📌 Final Notes

---

## 🚀 Purpose
DevBuilder aims to accelerate backend development by automatically generating project scaffolds tailored to a developer's stack preferences. It supports Go, Python (Flask), and Node.js (Express) and allows enabling optional features like Docker setup.

---

## 🧩 Microservices Overview
| Service               | Role                                                                 |
|-----------------------|----------------------------------------------------------------------|
| 🚪 API Gateway         | Exposes REST and GraphQL endpoints. Communicates with backend services |
| ⚙️ GenerationService   | Builds the project structure based on user input                      |
| 🔍 ValidationService   | Validates configuration before generation                             |
| 📦 ZipService          | Compresses generated project into ZIP archive                         |
| 💾 StorageService      | Stores ZIP files locally                                              |

---

## 🛠️ Technologies Used
| Technology      | Role                                                           |
|-----------------|----------------------------------------------------------------|
| REST            | Primary interface exposed through API Gateway                 |
| GraphQL         | Alternative interface for custom queries & flexibility        |
| gRPC            | Internal communication between services (faster + type-safe)  |


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
```

---

## 🎯 Innovation Highlights
- Combines REST, GraphQL, gRPC in a single system  
- Modular: each service is independently scalable and testable  
- Pluggable architecture for adding more frameworks, databases, etc.  


---

## 📦 Dependencies & Installation
### API Gateway:
```bash
npm install express apollo-server-express graphql
```

### GenerationService:
```bash
npm install grpc @grpc/proto-loader fs-extra
```

### ZipService:
```bash
npm install archiver grpc @grpc/proto-loader
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
    message
  }
}
```

---

## 📁 .gitignore
```
node_modules/

```

---

## 📌 Final Notes
DevBuilder serves as a powerful tool for backend automation. Its microservices architecture ensures clean separation of concerns and scalability. Ideal for teams, bootstrappers, and anyone looking to rapidly prototype reliable backends.


© 2025 DevBuilder Project
