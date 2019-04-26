const express = require('express');
const passport = require('passport');

// Controller
const mangaController = require('../controllers/mangaController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all mangas
router.get('/mangas', mangaController.getAllMangas);

// Uploading a new manga, see especific manga, update a manga info, delete a manga
router.post('/manga/:user', requireToken, mangaController.addManga);
router.get('/manga/:id', mangaController.getMangaById);
router.put('/manga/:id', requireToken, mangaController.updateManga);
router.delete('/manga/:id', requireToken, mangaController.deleteManga);

module.exports = router;