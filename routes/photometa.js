var mongoose = require ('mongoose');
var schema = mongoose.Schema;
var objId = schema.ObjectId;

var photoMetaSchema = new schema({
  _id: String,
  user: String,
  date: String,
  location: String
},
{collection: "photometa"});

module.exports = mongoose.model('photoMeta', photoMetaSchema);