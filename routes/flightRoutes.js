const router = require('express').Router();
const c = require('../controllers/flightController');

router.get('/:id', c.flightDetails);

module.exports = router;
