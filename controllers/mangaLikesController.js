const pool = require('../helpers/db').pool;

module.exports = {
    getMangaLikes(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM likes_manga WHERE manga_id=$1';
            const mangaId = [req.params.id]
            client.query(query, mangaId, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'The manga has no likes',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        messge: 'Likes retrieved',
                        likes: result.rows,
                    });
                }
            });
        });
    },

    addMangaLike(req, res){

        const data = {
            //? Use bearer token to get the user_id
            user_id: req.body.user_id,
            manga_id: req.params.id,
        }
    
        pool.connect((err, client, done) => {
            //! Prevent the user to make multiple likes
            const query = 'INSERT INTO likes_manga(user_id, manga_id) VALUES ($1,$2) RETURNING *';
            const values = [data.user_id, data.manga_id];
    
            client.query(query, values, (error, result) => {
                done();
                if(error){
                    res.status(400).json({error});
                }
                res.status(202).send({
                    status: 'Successful',
                    result: result.rows[0]
                    // We should add a redirect to the manga page bc this is not an endpoint but an action
                });
            });
        });
    },

    deleteMangaLike(req, res){
        const likeId = {like_id: req.params.likeId}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM likes_manga WHERE like_id=$1'
            const data = [likeId.like_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'No more like',
                        comment: result.rows,
                    });
                    // We should add a redirect to the manga page bc this is not an endpoint but an action
                }
            });
        })
    },

}