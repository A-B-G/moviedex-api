const express = require('express');
const movieRouter = express.Router();
const movies = require('../moviedex-api.json');

//define endpoint
movieRouter.get('/genres', (req, res) => {
    let genres = movies.map(movie => movie.genre); 
    const { genre } = req.params;
    if(!genre) {
        return res.status(400).send("Please provide a genre.");
    }
    if(!genres.toLowerCase().includes(genre.toLowerCase())) {
        return res.send("Please provide a valid genre.")
    }
    let response = movies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
        res.json(response);  
});
movieRouter.get('/', (req, res) => {
    
        res.json(movies);
});

module.exports = movieRouter;
