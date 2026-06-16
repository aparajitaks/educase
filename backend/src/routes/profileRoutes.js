const express = require('express');
const router = express.Router();
const {
  analyzeProfile,
  getAllProfiles,
  getProfileByUsername,
} = require('../controllers/profileController');

// POST /api/profiles/:username — Analyze a GitHub profile
router.post('/:username', analyzeProfile);

// GET /api/profiles — Get all stored profiles
router.get('/', getAllProfiles);

// GET /api/profiles/:username — Get a single profile
router.get('/:username', getProfileByUsername);

module.exports = router;
