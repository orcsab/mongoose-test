var AWS = require('aws-sdk');

//  the key environment variables are detected by the AWS module.
if (typeof process.env.AWS_ACCESS_KEY_ID === "undefined") {
  throw "must define environment variable AWS_ACCESS_KEY_ID";
}
if (typeof process.env.AWS_SECRET_ACCESS_KEY === "undefined") {
  throw "must define environment variable AWS_SECRET_ACCESS_KEY";
}
if (typeof process.env.AWS_BUCKET === "undefined") {
  throw "must define environment variable AWS_BUCKET";
}

//  From http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
AWS.config.update({region: 'ap-southeast-1'});

//  From http://aws.amazon.com/sdkfornodejs/
var s3 = new AWS.S3();

function loadImage (key, data) {
  s3.createBucket({Bucket: process.env.AWS_BUCKET}, function() {
    var params = {Bucket: process.env.AWS_BUCKET, Key: key, Body: data};
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      else
        console.log("Successfully uploaded data to myBucket/myKey");
    });
  });
};

module.exports.loadImage = loadImage;