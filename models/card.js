//const {userSchema} = require('./user')
const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    required: true,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
   },
  likes:
    [{
      type: mongoose.Schema.Types.ObjectId, //HERE
      default: []
    }]

    //type: mongoose.Schema.Types.ObjectId,
    //mongoose.Schema.Types.ObjectId
  ,
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);