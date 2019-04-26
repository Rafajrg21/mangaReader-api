const express = require('express');
const passport = require('passport');

const passportService = require('../helpers/passport');

const userController = require('../controllers/userController');

const requireSignIn = passport.authenticate('local', {session:false});
const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

router.get('/token',requireToken,(req, res) => {
    res.send('Bitch lasagna')
});

router.get('/signin', requireSignIn, (req, res) => {
    res.send('Bitch lasagna')
})

router.post('/signIn', userController.signInUser);
router.get('logout', (req, res) => {
    req.logOut();
    res.send('You just logged out!');
})
router.get('/users', requireToken, userController.getAllUsers);
router.post('/signUp', userController.addUser);
router.get('/users/:id', requireToken, userController.getUserById);

module.exports = router;