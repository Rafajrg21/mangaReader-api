const express = require('express');
const passport = require('passport');

// Controller
const chapterCommentsController = require('../controllers/chapterCommentsController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all comments on a manga chapter
router.get('/manga/:id/chapter/:chapterId/comments', chapterCommentsController.getAllCommentsChapter);

// Create a new comment, see especific comment, edit a comment, delete a comment
router.post('/manga/:id/chapter/:chapterId/comments', requireToken, chapterCommentsController.addCommentChapter);
router.get('/manga/:id/chapter/:chapterId/comments/:commentId', chapterCommentsController.getChapterCommentById);
router.put('/manga/:id/chapter/:chapterId/comments/:commentId', requireToken, chapterCommentsController.updateComment);
router.delete('/manga/:id/chapter/:chapterId/comments/:commentId', requireToken, chapterCommentsController.deleteCommentChapter);

module.exports = router;