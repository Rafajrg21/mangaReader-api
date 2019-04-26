const pool = require('../helpers/db').pool;

module.exports = {
    getAllChapters(req, res){
        const mangaId = {manga_id: req.params.id}
        
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM chapters WHERE manga_id=$1';
            const data = [mangaId.manga_id]

            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No mangas found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        messge: 'Chapter list retrieved',
                        chapters: result.rows,
                    });
                }
            });
        });
    },

    getChapterById(req, res){
        const paramsId = {
            manga_id: req.params.id,
            chapter_id: req.params.chapterId,
        }
    
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM chapters WHERE manga_id=$1 AND chapter_id=$2'
            const data = [paramsId.manga_id, paramsId.chapter_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                if(result.rows < '1'){
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No manga found',
                    });
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Manga retrieved',
                        manga: result.rows,
                    });
                }
            });
        })
    },

    updateChapter(req, res){
        const data = {
            chapter_number: req.body.chapter_number,
            chapter_title: req.body.chapter_title,
            chapter_num_pages: req.body.chapter_num_pages,
        }
        const paramsId = {
            manga_id: req.params.id,
            chapter_id: req.params.chapterId,
        }
    
        pool.connect((err, client, done) => {
            const query = 'UPDATE chapters SET chapter_number=$1, chapter_title=$2, chapter_num_pages=$3 WHERE manga_id=$4 AND chapter_id=$5'
            const values = [data.chapter_number, data.chapter_title, data.chapter_num_pages, paramsId.manga_id, paramsId.chapter_id]
    
            client.query(query, values, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Manga updated',
                        manga: result.rows,
                    });
                }
            });
        })
    },

    deleteChapter(req, res){
        const chapterId = {chapter_id: req.params.chapterId}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM chapters WHERE chapter_id=$1'
            const data = [chapterId.chapter_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Chapter deleted',
                        chapter: result.rows,
                    });
                }
            });
        })
    },

}