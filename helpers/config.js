const config = {
    port: 3000,
    secret:'ultraS3KreT',
}

const dbConfig = {
    user: 'postgres',
    database: 'mangaReader',
    password: 'masterkey',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
}

//* As a side note: this file must be put in the .gitignore file for security reasons

module.exports = {config, dbConfig};