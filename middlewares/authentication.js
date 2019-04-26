const jwt = require('jwt-simple');
const config = require('../helpers/config').config;

const tokenForUser = (user) => {
    const timestamp = new Date().getTime()
    return jwt.encode({sub: user.user_id, iat: timestamp}, config.secret)
}

const signin = (req, res, next) => {
    res.send({token: tokenForUser(req.user)})
}

module.exports = {signin, tokenForUser};
