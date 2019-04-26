const pg = require('pg');
const config = require('../helpers/config').dbConfig;

const pool = new pg.Pool(config);

pool.on('connect', () => {
    console.log('Connected to the database!');
});

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

module.exports = { pool };