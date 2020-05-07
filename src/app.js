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
const movieRouter = require('./router/movieRouter');


app.use(morgan(morganOptions));
app.use(cors());
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {

    const bearerToken = req.get('Authorization');
    const authToken = process.env.API_TOKEN;
    if(!authToken || authToken.split(' ')[1] !== bearerToken) {
        return res.status(401).json({ error: "Unauthorized request." } );
    }
    next();
})
const movies = require('./moviedex-api.json');

const handleGetAverageVotes = (req, res) => {
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
}
app.get('/', movieRouter);
app.use('/movie', movieRouter);
app.get('/genres', movieRouter);
app.get('/average-votes', handleGetAverageVotes);
//set up error messages based on environment
app.use(function errorHandler(error, req, res, next) {
    let response;
    if(NODE_ENV === 'production') {
        response = { error: { message: 'Heck! We haz error.' } }
        } else {
            response = { message: error.message, error }
        }
        res.status(500).json(response);
    });

module.exports = app;
