const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router()

// Signup
router.post('/signup', signup)

// Login
router.post('/login', login)

module.exports = router