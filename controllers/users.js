const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/errors');

const { JWT_SECRET = 'super secret key' } = process.env;

function errHandler(err, req, res, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    err.statusCode = 409;
    err.message = 'Такой пользователь уже существует';
  } else if (err.name === 'CastError' || err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля';
  }
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    }); // добавили catch .catch(err => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash // записываем хеш в базу
      }))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        errHandler(err);
        next(err);
      });
  } else {
    res.send('Введите корректный email');
  }
};

module.exports.patchInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};
