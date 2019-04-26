const express = require('express');
const passport = require('passport');

// Controller
const mangaLikesController = require('../controllers/mangaLikesController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all likes on a manga 
router.get('/manga/:id/likes', mangaLikesController.getMangaLikes);

// Add a like and delete that like
router.post('/manga/:id/like', requireToken, mangaLikesController.addMangaLike);
router.delete('/manga/:id/like/:likeId', requireToken, mangaLikesController.deleteMangaLike);

module.exports = router;