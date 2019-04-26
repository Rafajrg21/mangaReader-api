const pool = require('../helpers/db').pool;

module.exports = {
    getAllMangas(req, res){
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM manga';
            client.query(query, (error, result) => {
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
                        messge: 'Manga list retrieved',
                        mangas: result.rows,
                    });
                }
            });
        });
    },

    addManga(req, res){
        let d = new Date();
        let creation = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`; 

        const data = {
            user_id: req.params.user,
            manga_name: req.body.manga_name,
            manga_synopsis: req.body.manga_synopsis,
            manga_status: req.body.manga_status,
            manga_creation_time: creation,
        }
    
        pool.connect((err, client, done) => {
            const query = 'INSERT INTO manga(user_id, manga_name, manga_synopsis, manga_status, manga_creation_time) VALUES ($1,$2,$3,$4,$5) RETURNING *';
            const values = [data.user_id, data.manga_name, data.manga_synopsis, data.manga_status, data.manga_creation_time];
    
            console.log(data.user_id)
            console.log(data.manga_creation_time)
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

    getMangaById(req, res){
        const mangaId = {manga_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'SELECT * FROM manga WHERE manga_id=$1'
            const data = [mangaId.manga_id]
    
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

    updateManga(req, res){
        const data = {
            manga_name: req.body.manga_name,
            manga_synopsis: req.body.manga_synopsis,
            manga_status: req.body.manga_status,
        }
        const mangaId = {manga_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'UPDATE manga SET manga_name=$1, manga_synopsis=$2, manga_status=$3 WHERE manga_id=$4'
            const values = [data.manga_name, data.manga_synopsis, data.manga_status, mangaId.manga_id]
    
            console.log(mangaId.manga_id)
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

    deleteManga(req, res){
        const mangaId = {manga_id: req.params.id}
    
        pool.connect((err, client, done) => {
            const query = 'DELETE FROM manga WHERE manga_id=$1'
            const data = [mangaId.manga_id]
    
            client.query(query, data, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({error})
                }
                else {
                    res.status(200).send({
                        status: 'Successful',
                        message: 'Manga deleted',
                        manga: result.rows,
                    });
                }
            });
        })
    },

}