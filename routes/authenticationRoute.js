const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
router.get('/home', authenticationController.home);
router.get('/signup', authenticationController.register);
router.post('/signup', authenticationController.signup);
// Need the following route to send the login form to the browser/USER
router.get('/login', authenticationController.loginForm);
router.post('/login', authenticationController.login);

router.post('/logout', authenticationController.logout);

module.exports = router; //Michael Brown ASU IFT458