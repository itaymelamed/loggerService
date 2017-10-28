const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ResultSchema = new Schema({
    Status: String,
    StackTrace: String,
    ErrorMessage: String,
    ScreenShot: String,
    Url: String
});
    
const TestSchema = new Schema({
    TestName: String,
    Steps: [String],
    Result: ResultSchema,
    TestRunId: String,
    Date: String,
    EnvironmentType: String
});

module.exports = TestSchema