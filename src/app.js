//initialize dotenv
require('dotenv').config();
const express = require('express');
//add logging library
const morgan = require('morgan');
//add basic middleware
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
//set morgan to be less verbose in production
const morganOptions = (NODE_ENV === "production") 
    ? 'tiny'
    : 'common';

app.use(morgan(morganOptions));
app.use(cors());
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {
    console.log(`validateBearerToken middleware`);

    const bearerToken = req.get('Authorization');
    const authToken = process.env.API_TOKEN;
    if(!authToken || authToken.split(' ')[1] !== bearerToken) {
        return res.status(401).json({ error: "Unauthorized request." } );
    }
    next();
})
const movies = require('./moviedex-api.json');

function handleGetGenre(req, res) {
    const genres = movies.map(movie => movie.genre);
    if(!genre) {
        return res.status(400).send("Please provide a genre.")
    }
    const genre = req.query.genre;
    if(!genre.toLowerCase().includes(genre.toLowerCase())) {
        return res.send(`Valid genres are ${genres}`);
    } 
    let response = movies.filter(movie => genre.toLowerCase().includes(movie.genre.toLowerCase()))
    res.json(response);
    
};
function handleGetMovies(req, res) {
  let response = movies; 
    res.json(response);  
};
const handleGetCountry = (req, res) => {
    const country = req.query.country;
    if(!country || !country.toLowerCase().includes(movies.country.toLowerCase())) {
        return res.status(400).send("Please provide a valid country.");
    }
    let response = movies.filter(movie => country.toLowerCase().includes(movie.country.toLowerCase()));
    res.send(response);
}
const handleGetAverageVotes = (req, res) => {
    let avgVotes = req.query.avg_votes;
    avgVotes = parseFloat(avgVotes);
    if(!avgVotes) {
        return res.status(400).send("Please provide a number representing the average votes for a movie.");
    }
    if(avgVotes === NaN || avgVotes === null) {
        return res.status(400).send("Please provide a valid number.");
    }
console.log(typeof avgVotes)
    let response = movies.filter(movie => avgVotes <= movie.avg_votes);
    res.json(response);
}
app.get('/movie', handleGetMovies);
app.get('/genres', handleGetGenre);
app.get('/country', handleGetCountry);
app.get('/average-votes', handleGetAverageVotes);
//set up error messages based on environment
app.use(function errorHandler(error, req, res, next) {
    let response;
    if(NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
        } else {
            console.log(error);
            response = { message: error.message, error }
        }
        res.status(500).json(response);
    });

module.exports = app;
