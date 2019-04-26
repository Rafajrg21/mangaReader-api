const pool = require('./db').pool;

const findUserById = (id) => {
    const query = 'SELECT * FROM users WHERE user_id=$1'
    pool.query(query, id)
    .then(res => {
        res.send(res.rows[0])
        console.log(res.rows[0])
    })
    .catch(error => console.log(error.stack))
}

const verifyUser = (username) => {
    const query = 'SELECT * FROM users WHERE user_username=$1'
    pool.query(query, username)
    .then(res => {
        res.send(res.rows[0])
        console.log(res.rows[0])
    })
    .catch(error => console.log(error.stack))
}

module.exports = {findUserById, verifyUser}