const express = require('express');
const { signup, login, getUsers } = require('../controllers/authController');

const router = express.Router()

// Signup
router.post('/signup', signup)

// Login
router.post('/login', login)

router.get('/', getUsers)

module.exports = router