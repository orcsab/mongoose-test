var express = require('express');
var port = process.env.PORT || 3002;
var port = 80;
var app = express();
var util = require('util');

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

util.debug("listening on port $port");
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
    pm = new photoMeta({
        _id: "12345",
        user: "Dave",
        date: "7 June 1974",
        location: "Singapore"
    });

    pm.save(function(err) {
        if (err) { throw err;}
        res.send(pm);
    });
});

module.exports = app;
