const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return (!!v.match(regex));
      },
      message: 'Неверная ссылка на изображение'
    }
  },
  owner: {
    required: true,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  },
  likes:
    [{
      type: mongoose.Schema.Types.ObjectId,
      default: []
    }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);
