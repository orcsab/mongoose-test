var express = require('express');
var port = process.env.PORT || 4791;
var app = express();
var util = require('util');
var bodyParser = require('body-parser');
var gm = require("gm");

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
app.use(bodyParser({limit: '50mb'}));

var aws = require('./routes/aws.js');
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

    var original = new Buffer(req.body.data);
    var thumb = new Buffer(1000000);
    //  This stuff is from here: https://www.npmjs.org/package/gm
    gm(original).resize(200, 200).toBuffer(function (err, thumb) {
        if (err) {
            console.log('/postPhoto: resize failure' + err.toString());
            return handle(err);
        }
        console.log('/postPhoto: resize success');
    });

    var date = new Date();
    var key = req.body.meta.user + "-" + date;
    pm = new photoMeta({
        _id: key,
        creator: req.body.meta.user,
        date: date,
        location: req.body.meta.location,
        caption: req.body.meta.caption
    });

    pm.save(function(err) {
        if (err) { throw err;}
    });

    aws.loadImage(key + "-orig", req.body.data);
    aws.loadImage(key + "-thumb", thumb.toString());

    res.send(key);
});

module.exports = app;
