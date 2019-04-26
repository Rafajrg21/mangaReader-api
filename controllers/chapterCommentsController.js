const pool = require('../helpers/db').pool;

module.exports = {
    getAllCommentsChapter(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM comments_chapter WHERE chapter_id=$1';
            const chapterId = [req.params.chapterId]
            client.query(query, chapterId, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'The chapter has no comments',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        messge: 'Comments retrieved',
                        comments: result.rows,
                    });
                }
            });
        });
    },

    addCommentChapter(req, res){
        let d = new Date();
        let creation = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`

        const data = {
            user_id: req.body.user_id,
            chapter_id: req.params.chapterId,
            comment_content: req.body.comment_content,
            comment_creation_time: creation, 
        }
    
        pool.connect((err, client, done) => {
            const query = 'INSERT INTO comments_chapter(user_id, chapter_id, comment_content, comment_creation_time) VALUES ($1,$2,$3,$4) RETURNING *';
            const values = [data.user_id,data.chapter_id,data.comment_content,data.comment_creation_time];
    
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

    getChapterCommentById(req, res){
        const paramsIds = {
            chapter_id: req.params.chapterId,
            comment_id: req.params.commentId
        }
    
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM comments_chapter WHERE comment_id=$1 AND chapter_id=$2'
            const data = [paramsIds.comment_id, paramsIds.chapter_id]
            
            console.log(data)
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'Non existing comment',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Comment retrieved',
                        comment: result.rows,
                    });
                }
            });
        })
    },

    updateComment(req, res){
        const data = {
            comment_content: req.body.comment_content,
        }

        const paramsIds = {
            chapter_id: req.params.chapterId,
            comment_id: req.params.commentId
        }
    
        pool.connect((err, client, done) => {
            const query = 'UPDATE comments_chapter SET comment_content=$1 WHERE comment_id=$2 AND chapter_id=$3'
            const values = [data.comment_content, paramsIds.comment_id, paramsIds.chapter_id]
    
            client.query(query, values, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Comment updated',
                        comment: result.rows,
                    });
                }
            });
        })
    },

    deleteCommentChapter(req, res){
        const commentId = {comment_id: req.params.commentId}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM comments_chapter WHERE comment_id=$1'
            const data = [commentId.comment_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Comment deleted',
                        comment: result.rows,
                    });
                }
            });
        })
    },

}