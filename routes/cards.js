const router = require('express').Router();
const {
  getCards, createCards, deleteCards, likeCard, dislikeCard
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCards);
router.delete('/:cardId', deleteCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
