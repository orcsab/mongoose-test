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

function putObject (key, data) {
  s3.createBucket({Bucket: process.env.AWS_BUCKET}, function() {
    var params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: data,
      ContentType: "image/jpeg"
    };

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      else
        console.log("Successfully uploaded data to " + process.env.AWS_BUCKET + "/" + key);
    });
  });
};

//  params:
//  key: the key of the object to fetch
//  res: the res object to stream the result to
function getObject (key, res) {
  if (!key)
    throw "aws.getObject must receive a non-empty string";

  s3.createBucket({Bucket: process.env.AWS_BUCKET}, function() {
    var params = {Bucket: process.env.AWS_BUCKET, Key: key};
    s3.getObject(params, function(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      // console.log("Successfully fetched: " + JSON.stringify(data.Body));
      res.send(data.Body);
    });
  });

}

//  params:
//  key: the key of the object to fetch
//  res: the res object to stream the result to
function getUrl (key, res) {
  if (!key)
    throw "aws.getUrl must receive a non-empty string";

  var params = {Bucket: process.env.AWS_BUCKET, Key: key};
  s3.getSignedUrl('getObject', params, function (err, url) {
    console.log("The URL is", url);
    res.send(url);
  });

}

module.exports.putObject = putObject;
module.exports.getObject = getObject;
module.exports.getUrl = getUrl;