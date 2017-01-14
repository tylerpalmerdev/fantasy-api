const express = require('express');
const bearerToken = require('express-bearer-token');
const lodash = require('lodash');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const config = require('./config');

let app = express();

let apiKeyCheck = (req, res, next) => {
    if (req.token && lodash.includes(config.VALID_API_KEYS, req.token)) {
        next();
    } else {
        res.sendStatus(403);
    }
}

if(config.MODE === 'DEV') {
    app.use(morgan('combined'));
}

app.use(bearerToken());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(apiKeyCheck);

// import endpoints file, initialized to express app
let routes = require('./routes')(app);

app.listen(config.PORT, () => {
    console.log("LISTENING ON ", config.PORT);
});

