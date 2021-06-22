const router = require('express').Router();
const {
  getUsers, getUsersMe, getUsersById, patchInfo, patchAvatar
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUsersMe);
router.get('/:userId', getUsersById);
router.patch('/me', patchInfo);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
