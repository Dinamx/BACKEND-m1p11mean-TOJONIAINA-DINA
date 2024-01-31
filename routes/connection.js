var express = require('express');
var router = express.Router();


const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        // await mongoose.connect('mongodb+srv://poseidon:poseidon@poseidon.jpmfmcc.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
        await mongoose.connect('mongodb+srv://poseidon:poseidon@poseidon.jpmfmcc.mongodb.net/?retryWrites=true&w=majority');
        console.log('Mongo connected');
    } catch (error) {
        console.error('Could not connect to MongoDB...', error);
    }
};

module.exports = connectToDb;
