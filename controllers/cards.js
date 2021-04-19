const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.createCards = (req, res) => {
  const { name, link, owner } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err) {
        errorHandler(err, req, res)
      }
    });
};

module.exports.dislikeCard  = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
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
    return res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
  } else {res.status(500).send({ message: err.message })}
}