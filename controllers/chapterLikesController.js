const pool = require('../helpers/db').pool;

module.exports = {
    getChapterLikes(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM likes_chapter WHERE chapter_id=$1';
            const chapterId = [req.params.chapterId]
            client.query(query, chapterId, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'This chapter has no likes',
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

    addChapterLike(req, res){

        const data = {
            //? Use bearer token to get the user_id
            user_id: req.body.user_id,
            chapter_id: req.params.chapterId,
        }
    
        pool.connect((err, client, done) => {
            //! Prevent the user to make multiple likes
            const query = 'INSERT INTO likes_chapter(user_id, chapter_id) VALUES ($1,$2) RETURNING *';
            const values = [data.user_id, data.chapter_id];
    
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

    deleteChapterLike(req, res){
        const likeId = {like_id: req.params.likeId}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM likes_chapter WHERE like_id=$1'
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
                        like: result.rows,
                    });
                    // We should add a redirect to the manga page bc this is not an endpoint but an action
                }
            });
        })
    },

}