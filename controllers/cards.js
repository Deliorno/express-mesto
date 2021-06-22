const Card = require('../models/card');
const { NotFoundError } = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCards = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner == req.user._id) {
          card.remove();
          return res.send({ data: card });
        } if (card.owner !== req.user._id) {
          return res.status(403).send({ message: 'Карточка не ваша =Р' });
        }
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => next(err));
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => next(err));
};
