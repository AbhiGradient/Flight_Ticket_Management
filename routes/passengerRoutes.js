const router = require('express').Router();
const c = require('../controllers/passengerController');
const fc = require('../controllers/flightController');

router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'passenger') return next();
  res.redirect('/login');
});

router.get('/dashboard', c.dashboard);
router.get('/search', c.showSearch);
router.post('/search', c.searchFlights);
router.get('/all-flights', fc.allFlights);   // NEW
router.get('/profile', c.profile);
router.post('/profile', c.updateProfile);
router.get('/my-bookings', c.myBookings);
router.get('/booking-details/:id', c.bookingDetails);

module.exports = router;
