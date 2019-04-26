const express = require('express');
const passport = require('passport');

// Controller
const chapterLikesController = require('../controllers/chapterLikesController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all likes on a manga chapter
router.get('/manga/:id/chapter/:chapterId/likes', chapterLikesController.getChapterLikes);

// Create a new comment, see especific comment, edit a comment, delete a comment
router.post('/manga/:id/chapter/:chapterId/like', requireToken, chapterLikesController.addChapterLike);
router.delete('/manga/:id//chapter/:chapterId/like/:likeId', requireToken, chapterLikesController.deleteChapterLike);

module.exports = router;