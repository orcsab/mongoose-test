var express = require('express');
var port = process.env.PORT || 4791;
var app = express();
var util = require('util');
var bodyParser = require('body-parser');

//  CORS setup.  Taken from http://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser());

var mongoose = require('mongoose');
var photoMeta = require('./routes/photometa.js');
var mdbConfig = require('./routes/mdb-config.js');
util.debug("mdbConfig: " + JSON.stringify(mdbConfig));

var url = "mongodb://";
url += mdbConfig.config.user;
url += ":";
url += mdbConfig.config.pass;
url += "@";
url += mdbConfig.config.server;
url += ":";
url += mdbConfig.config.port;
url += "/"
url += mdbConfig.config.collection;
util.debug("url: " + url);
mongoose.connect(url);
// app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

util.debug("listening on port " + port);
app.listen(port, function() {
    console.log("mongoose-test is listening on " + port);
});

app.get('/getPhotos', function (req, res) {
    // more on find: http://mongoosejs.com/docs/api.html#model_Model.find
    photoMeta.find({}, {}, function(err, meta) {
        if (err) { throw err;}
        res.send(meta);
        // res.send('Hello world.');
    })
});

app.post('/postPhoto', function(req, res) {
    console.log('POST /postPhoto');
    console.dir(req.body);
    pm = new photoMeta({
        _id: 45678,
        creator: req.body.user,
        date: req.body.date,
        location: req.body.location,
        caption: req.body.caption
    });

    pm.save(function(err) {
        if (err) { throw err;}
        res.send(pm);
    });
});

module.exports = app;
