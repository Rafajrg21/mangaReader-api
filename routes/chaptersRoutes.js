const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs-extra')

// Requiring the pool for query execution
const pool = require('../helpers/db').pool;

// Multer configuration
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let manga = req.params.id;
        let path = `./public/images/${manga}`; //? How to access and append the chapter title
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
            cb(null, path);
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if (file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if (file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if (file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, `image-${Date.now()}.${filetype}`);
    }
  });
  
  let upload = multer({
    storage: storage
  })

// Controller
const chapterController = require('../controllers/chapterController');

const requireToken = passport.authenticate('jwt', {session:false});

const router = express.Router()

// Getting all manga chapters
router.get('/manga/:id/chapters', chapterController.getAllChapters);

// Uploading a new chapter
router.post('/manga/:id/chapters', requireToken, upload.array('files[]'),
(req, res) => {
    let d = new Date();
    let creation = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`; 
    
    const data = {
        manga_id: req.params.id,
        chapter_number: req.body.chapter_number,
        chapter_title: req.body.chapter_title,
        chapter_location: req.files[0].destination,
        chapter_num_pages: req.body.chapter_num_pages,
        chapter_creation_time: creation,
    }

    pool.connect((err, client, done) => {
        const query = 'INSERT INTO chapters(manga_id, chapter_number, chapter_title, chapter_location, chapter_num_pages, chapter_creation_time) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
        const values = [data.manga_id, data.chapter_number, data.chapter_title, data.chapter_location, data.chapter_num_pages, data.chapter_creation_time];
        
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
});

// See especific chapter, update a chapter info, delete a chapter
router.get('/manga/:id/chapters/:chapterId', chapterController.getChapterById);
router.put('/manga/:id/chapters/:chapterId', requireToken, chapterController.updateChapter);
router.delete('/manga/:id/chapters/:chapterId', requireToken, chapterController.deleteChapter);

module.exports = router;