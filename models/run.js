const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultsScheme = new Schema({
    Passed: Number,
    Failed: Number,
    SentToHub: Number,
    Running: Number
});

const RunScheme = new Schema({
    TestRunId: String,
    Env: String,
    Date: String,
    Results: ResultsScheme
});

module.exports = RunScheme