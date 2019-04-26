const passport = require('passport');
const config = require('./config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const pool = require('./db').pool;
const {verifyUser} = require('./signin');

// Local Strategy Setup
const localOptions = {usernameField: 'username'}

const localLogin = new LocalStrategy(localOptions, (username,password,done) => {
    return verifyUser(username)
    .then((validUser) => {
        bcrypt.compareSync(password, validUser.password)
        .then((validPassword) => {
            if (validPassword) {
                return done(null, validUser)
            }
            return done(null, false)
        })
        .catch(err => {throw err;})
    })
    .catch(err => {throw err;})
})

// Jwt Strategy Setup
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.config.secret,
}

// Create the Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('payload received', jwt_payload.id);
    
    let user = {}

    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM users WHERE user_id=$1'

        client.query(query, [jwt_payload.id], (error, result) => {
            //done();
            if(error){
                console.log(error.stack)
            }
            if(result.rows < '1'){
                console.log('there is no record')
            }
            else {
                user = result.rows 
                return (user)
            }
        });
    })
    return next(null, user)
})

passport.use(jwtLogin)
passport.use(localLogin)