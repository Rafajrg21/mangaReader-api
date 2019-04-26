const bcrypt = require('bcrypt');
const pool = require('../helpers/db').pool;
const jwt = require('jsonwebtoken');
const config = require('../helpers/config').config;
const saltRounds = 12;

module.exports = {
    getAllUsers(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM users';
            client.query(query, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No users found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        messge: 'Users retrieved',
                        users: result.rows,
                    });
                }
            });
        });
    },

    addUser(req, res){
        const hashed = bcrypt.hashSync(req.body.user_password, saltRounds)
        let d = new Date();
        let creation = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`

        const data = {
            type_id: req.body.type_id,
            user_password: hashed,
            user_username: req.body.user_username,
            user_name: req.body.user_name,
            user_creation_time: creation,
            user_email: req.body.user_email,
        }
    
        pool.connect((err, client, done) => {
            const query = 'INSERT INTO users(type_id, user_password, user_username, user_name, user_creation_time, user_email) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
            const values = [data.type_id, data.user_password, data.user_username, data.user_name, data.user_creation_time, data.user_email];
    
            client.query(query, values, (error, result) => {
                done();
                if(error){
                    res.status(400).json({error});
                }
                
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign({id: result.user_id}, config.secret, {
                    expiresIn: expiresIn
                });

                res.status(202).send({
                    status: 'Successful',
                    result: result.rows[0],
                    accessToken: accessToken,
                    expiresIn: expiresIn
                });
            });
        });
    },

    getUserById(req, res){
        const userId = {user_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM users WHERE user_id=$1'
            const data = [userId.user_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    console.log(userId)
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No user found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'User retrieved',
                        users: result.rows,
                    });
                }
            });
        })
    },

    signInUser(req, res) {
        const data = {
            username: req.body.username,
            password: req.body.password
        }

        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM users WHERE user_username=$1';
            const values = [data.username];
    
            client.query(query, values, (error, result) => {
                done();
                if(error){
                    res.status(400).json({error});
                }
                if(result.rows < 1){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No user found',
                    });
                } else {
                    const pass = bcrypt.compareSync(data.password, result.rows[0].user_password);
                    if(!pass){
                        res.status(401).send({
                            status: 'Failed',
                            message: 'Password not valid!'
                        });
                    }

                    const expiresIn = 24*60*60;
                    const accessToken = jwt.sign({id: result.rows[0].user_id}, config.secret, {
                        expiresIn: expiresIn
                    });
    
                    res.status(200).send({
                        status: 'Successful',
                        message: 'User verified',
                        users: result.rows[0],
                        accessToken: accessToken,
                        expiresIn: expiresIn
                    });
                }
            });
        });
    },
}