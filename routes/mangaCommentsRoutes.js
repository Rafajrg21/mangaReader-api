const express = require('express');
const passport = require('passport');

// Controller
const mangaCommentsController = require('../controllers/mangaCommentsController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all comments on a manga
router.get('/manga/:id/comments', mangaCommentsController.getAllCommentsManga);

// Create a new comment, see especific comment, edit a comment, delete a comment
router.post('/manga/:id/comments', requireToken, mangaCommentsController.addCommentManga);
router.get('/manga/:id/comments/:commentId', mangaCommentsController.getCommentMangaById);
router.put('/manga/:id/comments/:commentId', requireToken, mangaCommentsController.updateComment);
router.delete('/manga/:id/comments/:commentId', requireToken, mangaCommentsController.deleteCommentManga);

module.exports = router;