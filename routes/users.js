const router = require('express').Router();
const { getUsers, createUsers, getUsersById, patchInfo, patchAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUsers);
router.get('/:userId', getUsersById);
router.patch('/me', patchInfo);
router.patch('/me/avatar', patchAvatar);

module.exports = router;