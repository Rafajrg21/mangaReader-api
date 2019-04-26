const express = require('express');
const passport = require('passport');

// Controller
const genresController = require('../controllers/mangaGenreController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all genres
router.get('/genres', genresController.getAllGenres);

// Create a new genre, see especific genre, update a genre desc, delete a genre
router.post('/genres/newGenre', requireToken, genresController.addGenre);
router.get('/genres/:id', genresController.getGenreById);
router.put('/genres/:id', requireToken, genresController.updateGenre);
router.delete('/genres/:id', requireToken, genresController.deleteGenre);

module.exports = router;