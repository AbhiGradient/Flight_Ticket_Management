
const router = require('express').Router();
const c = require('../controllers/authController');

router.get('/login', c.showLogin);
router.post('/login', c.login);
router.post('/admin/login', c.adminLogin);
router.get('/register', c.showRegister);
router.post('/register', c.register);
router.get('/logout', c.logout);

module.exports = router;
