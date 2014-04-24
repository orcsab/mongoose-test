var express = require('express');
var port = process.env.PORT || 3002;
var app = express();

var mongoose = require('mongoose');
var photoMeta = require('./routes/photometa.js');

mongoose.connect('mongodb://mipitw:mipitw@oceanic.mongohq.com:10006/mipitw');
// app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.listen(port, function() {
    console.log("mongoose-test is listening on " + port);
});

app.get('/getPhotos', function (req, res) {
    // more on find: http://mongoosejs.com/docs/api.html#model_Model.find
    photoMeta.find({}, 'user', function(err, photo) {
        if (err) { throw err;}
        res.send(photo);
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
