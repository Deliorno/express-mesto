const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.patchInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError'){
    return res.status(400).send('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля')
  } else if (err.message && ~err.message.indexOf('Cast to ObjectId failed')){
    return res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
  } else {res.status(500).send({ message: err.message })}
}

