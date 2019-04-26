// Initial requires and port 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// port config
const config = require('./helpers/config').config;
const port = process.env.PORT || config.port;

// Adding the routes
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/mangaGenreRoutes');
const mangaRoutes = require('./routes/mangaRoutes');
const mangaCommentsRoutes = require('./routes/mangaCommentsRoutes');
const mangaLikesRoutes = require('./routes/mangaLikesRoutes');
const chaptersRoutes = require('./routes/chaptersRoutes');
const chaptersCommentsRoutes = require('./routes/chapterCommentsRoutes');
const chaptersLikesRoutes = require('./routes/chapterLikesRoutes');
const subscribeRoute = require('./routes/subscribeRoute');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Initialize the routes, using the prefix mr
app.use('/mr/', [userRoutes, genreRoutes, mangaRoutes, mangaCommentsRoutes, mangaLikesRoutes, chaptersRoutes, chaptersCommentsRoutes, chaptersLikesRoutes, subscribeRoute]);

// Start the server
app.listen(port, () => {
    console.log(`We are live at SNL... i mean listening on ${port}`)
});