// routes/project.routes.js
const express = require('express');
const router = express.Router();
const { generateProject } = require('./controller.js');

// Route pour générer un projet
router.post('/generate-project', generateProject);

module.exports = router;
