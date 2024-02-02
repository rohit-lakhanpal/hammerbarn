const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors');

require('dotenv').config();

const Utils = require('./helper/utils');
const DataSeeder = require('./helper/seedProducts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup CORS
var corsOptions = Utils.getCorsOptions();
if(corsOptions.origin.length > 0) {
    console.log(`CORS options: ${JSON.stringify(corsOptions)}`);
    app.use(cors(corsOptions));
}

// Custom middleware to log request origin
app.use(function (req, res, next) {
    console.log(`Request from origin ${req.headers.origin}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/get-listings', require('./routes/listings'));
app.use('/.well-known', require('./routes/well-known'));

const accountName = process.env.AZURE_SEARCH_SERVICE_NAME;
const accountKey = process.env.AZURE_SEARCH_ADMIN_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
const oaiResourceName = process.env.AZURE_OPENAI_RESOURCE_NAME;
const oaiKey = process.env.AZURE_OPENAI_KEY;
const embeddingsModel = process.env.AZURE_OPENAI_EMBEDDINGS_MODEL;

if (!accountName || !accountKey || !indexName || !oaiResourceName || !oaiKey || !embeddingsModel) {
    console.error(error.message);
    process.exit(1);
}

try {
    var seeder = new DataSeeder(accountName, accountKey, indexName, oaiResourceName, oaiKey, embeddingsModel);
    seeder.createProductSearchIndex().then(() => {
        //seeder.seedData(path.join(__dirname, 'data', 'products'));
    });
} catch (error) {
    console.error(error.message);
}

module.exports = app;
