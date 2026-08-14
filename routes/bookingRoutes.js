const router = require('express').Router();
const seatC = require('../controllers/seatController');
const bookC = require('../controllers/bookingController');

router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'passenger') return next();
  res.redirect('/login');
});

router.get('/seats/:flightId', seatC.showSeats);
router.get('/passenger-details', bookC.showPassengerDetails);
router.post('/passenger-details', bookC.savePassengerDetails);
router.get('/payment', bookC.showPayment);
router.post('/payment', bookC.processPayment);
router.get('/confirmation/:id', bookC.confirmation);
router.get('/cancel/:id', bookC.cancel);

module.exports = router;
