const generateExpress = require('./express');
const generateFlask = require('./flask');
const generateGo = require('./go');

function generateProject({ framework, language, projectName }) {
  switch (framework.toLowerCase()) {
    case 'express':
      return generateExpress({ language, projectName });
    case 'go':
      return generateGo({ language, projectName });
    case 'flask':
      return generateFlask({projectName });
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

module.exports = { generateProject };