const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose');
const TestSchema = require('../models/test');
const RunsSchema = require('../models/run');

router.get('/testsRunsIds', function(req, res, next){
    const RunModel = mongoose.model('Run', RunsSchema, `Runs`);
    RunModel.find({}).then(function(runs){
        res.send(runs.map(run => run));
    });
});

router.get('/tests', function(req, res, next){
    const id = req.query.id;
    const TestModel = mongoose.model('Test', TestSchema, `testRun${id}`);
    TestModel.find({TestRunId : id}).then(function(tests){
        res.send(tests);
    });
});

router.get('/adsTxt', function(req, res, next){
    const RunModel = mongoose.model('Run', RunsSchema, `Runs`);
    RunModel.find({Category : "AdsTxt"}).then(function(runs){
        res.send(runs.map(run => run));
    });
});

module.exports = router;