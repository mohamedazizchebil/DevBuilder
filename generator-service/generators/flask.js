const fs = require('fs-extra');
const path = require('path');

async function generateFlask({ projectName, outputDir = './../generated-projects' }) {
  if (!projectName) {
    throw new Error('Project name is required.');
  }

  const projectPath = path.join(outputDir, projectName);
  fs.ensureDirSync(projectPath);

  // Créer requirements.txt
  fs.writeFileSync(
    path.join(projectPath, 'requirements.txt'),
    `flask`
  );

  // Créer app.py
  fs.writeFileSync(
    path.join(projectPath, 'app.py'),
    `from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Flask project: ${projectName}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`
  );

  // Créer Dockerfile (optionnel)
  fs.writeFileSync(
    path.join(projectPath, 'Dockerfile'),
    `FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]`
  );



      // .gitignore (optionnel)
    const gitignoreContent = `__pycache__/
*.pyc
.env
*.log
`;
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

    // README.md
    const readmeContent = `# ${projectName}

A simple Flask app.

## 🚀 Getting Started

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
\`\`\`

## 🐳 Docker

\`\`\`bash
docker build -t ${projectName}-image .
docker run -p 5000:5000 ${projectName}-image
\`\`\`
`;
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);






  console.log('✅ Flask project created at ' + projectPath);
  return { success: true, path: projectPath };
}

module.exports = generateFlask;
