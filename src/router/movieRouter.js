const express = require('express');
const movieRouter = express.Router();
const movies = require('../moviedex-api.json');

//define endpoints
movieRouter.route('/')
    .get((req, res) => {
    let { search = '' } = req.query; 
    res.json(movies);
});
movieRouter.route('/genres')
    .get((req, res) => {
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
movieRouter.route('/country')
    .get((req, res) => {
        const country = req.query.country;
        if(!country || !country.toLowerCase().includes(movies.country.toLowerCase())) {
            return res.status(400).send("Please provide a valid country.");
        }
    let response = movies.filter(movie => country.toLowerCase().includes(movie.country.toLowerCase()));
    res.send(response);
    });

    movieRouter.route('/average-votes')
        .get((req, res) => {
            let avgVotes = req.query.avg_votes;
            avgVotes = parseFloat(avgVotes);
            if(!avgVotes) {
                return res.status(400).send("Please provide a number representing the average votes for a movie.");
            }
            if(avgVotes === NaN || avgVotes === null) {
                return res.status(400).send("Please provide a valid number.");
            }
        let response = movies.filter(movie => avgVotes <= movie.avg_votes);
        res.json(response);
    });

module.exports = movieRouter
