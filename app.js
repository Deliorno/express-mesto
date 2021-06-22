// http://localhost:3000/users
const mongoose = require('mongoose');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const crypto = require('crypto'); // экспортируем crypto

// console.log(JWT_SECRET)

const { PORT = 3005 } = process.env;
const { login, createUsers } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'http://deliorno.mesto-react.nomoredomains.icu',
  'https://deliorno.mesto-react.nomoredomains.icu'
];

app.use(
  cors({
    origin: allowedCors
    // credentials:true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', login);
app.post('/signup', createUsers);
app.use(auth);
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use(errorLogger); // подключаем логгер ошибок

// app.use(errors()); обработчик ошибок celebrate

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Обращение по неизвестному адресу' });
});
app.use((err, req, res, next) => {
  // console.log(err.message);
  if (err.statusCode || err.code || err.name) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).send({ message: 'Необходима авторизация, срок действия токена истек' });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      res.status(409).send({ message: 'Такой пользователь уже существует' });
    } else if (err.name === 'CastError' || err.name === 'ValidationError') {
      // console.log(req.user._id);
      res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
    } else {
      res.status(err.statusCode).send({ message: err.message });
    }
  } else {
    res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
