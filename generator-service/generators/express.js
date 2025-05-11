const fs = require('fs-extra');
const path = require('path');

async function generateExpress({ projectName, outputDir = './../generated-projects' }) {
  if (!projectName || typeof projectName !== 'string' || projectName.trim() === '') {
    throw new Error('Project name is required and must be a non-empty string.');
  }

  const projectPath = path.resolve(outputDir, projectName);
  fs.ensureDirSync(projectPath);

  // Créer package.json
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: `A simple Express.js project named ${projectName}`,
      main: 'app.js',
      scripts: {
        start: 'node app.js',
        dev: 'nodemon app.js'
      },
      dependencies: {
        express: '^4.17.1'
      },
      devDependencies: {
        nodemon: '^2.0.22'
      }
    }, null, 2)
  );

  // Créer app.js
  fs.writeFileSync(
    path.join(projectPath, 'app.js'),
    `
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express.js project: ${projectName}');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
    `.trimStart()
  );

  // Créer Dockerfile
  fs.writeFileSync(
    path.join(projectPath, 'Dockerfile'),
    `FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000`
  );

  // Ajouter un README.md
  fs.writeFileSync(
    path.join(projectPath, 'README.md'),
    `# ${projectName}

This is a basic Express.js project.

## Install dependencies

\`\`\`bash
npm install
\`\`\`

## Run

\`\`\`bash
npm start
\`\`\`

## Dev Mode (auto-restart)

\`\`\`bash
npm run dev
\`\`\`

## Docker

\`\`\`bash
docker build -t ${projectName.toLowerCase()} .
docker run -p 3000:3000 ${projectName.toLowerCase()}
\`\`\`
`
  );

  console.log('✅ Express.js project created at ' + projectPath);
  return { success: true, path: projectPath };
}

module.exports = generateExpress;
