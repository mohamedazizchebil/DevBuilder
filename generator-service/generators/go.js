const fs = require('fs-extra');
const path = require('path');

async function generateGo({ projectName, outputDir = './../generated-projects' }) {
  if (!projectName) {
    throw new Error('Project name is required.');
  }

  const projectPath = path.resolve(outputDir, projectName);
  fs.ensureDirSync(projectPath);

  // Créer main.go
  fs.writeFileSync(
    path.join(projectPath, 'main.go'),
    `
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/", func(c *gin.Context) {
    c.String(200, "Hello from Gin Go project: ${projectName}")
  })
  r.Run() // Default :8080
}
    `.trimStart()
  );

  // Créer go.mod
  fs.writeFileSync(
    path.join(projectPath, 'go.mod'),
    `
module ${projectName}

go 1.18

require github.com/gin-gonic/gin v1.9.1
    `.trimStart()
  );

  // Créer Dockerfile
  fs.writeFileSync(
    path.join(projectPath, 'Dockerfile'),
    `FROM golang:1.18-alpine
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o app
CMD ["./app"]
EXPOSE 8080`
  );

  // Créer README.md (bonus non destructif)
  fs.writeFileSync(
    path.join(projectPath, 'README.md'),
    `# ${projectName}

Simple Go project using [Gin](https://github.com/gin-gonic/gin)

## Usage

\`\`\`bash
go mod tidy
go run main.go
\`\`\`

## Docker

\`\`\`bash
docker build -t ${projectName.toLowerCase()} .
docker run -p 8080:8080 ${projectName.toLowerCase()}
\`\`\`
`
  );

  console.log('✅ Go Gin project created at ' + projectPath);
  return { success: true, path: projectPath };
}

module.exports = generateGo;
