const pool = require('../helpers/db').pool;

module.exports = {
    getAllGenres(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM genres';
            client.query(query, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No genres found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        messge: 'Genres list retrieved',
                        genres: result.rows,
                    });
                }
            });
        });
    },

    addGenre(req, res){
        const data = {
            genre_des: req.body.genre_des 
        }
    
        pool.connect((err, client, done) => {
            const query = 'INSERT INTO genres(genre_des) VALUES ($1) RETURNING *';
            const values = [data.genre_des];
    
            client.query(query, values, (error, result) => {
                done();
                if(error){
                    res.status(400).json({error});
                }
                res.status(202).send({
                    status: 'Successful',
                    result: result.rows[0]
                });
            });
        });
    },

    getGenreById(req, res){
        const genresId = {genres_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM genres WHERE genres_id=$1'
            const data = [genresId.genres_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No genre found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Genre retrieved',
                        genre: result.rows,
                    });
                }
            });
        })
    },

    updateGenre(req, res){
        const data = {
            genre_res: req.body.genre_des,
        }
        const genresId = {genres_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'UPDATE genres SET genre_des=$1 WHERE genres_id=$2'
            const values = [data.genre_res, genresId.genres_id]
    
            client.query(query, values, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Genre updated',
                        genre: result.rows,
                    });
                }
            });
        })
    },

    deleteGenre(req, res){
        const genresId = {genres_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM genres WHERE genres_id=$1'
            const data = [genresId.genres_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Genre deleted',
                        genre: result.rows,
                    });
                }
            });
        })
    },

}