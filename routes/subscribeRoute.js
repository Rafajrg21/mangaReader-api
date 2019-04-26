const express = require('express');
const passport = require('passport');

// Controller
const subscribeController = require('../controllers/subscribeController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Add a subscription to a manga 
router.post('/mangas/:id/sub', requireToken, subscribeController.addSubscription);

module.exports = router;