const router = require('express').Router();
const a = require('../controllers/adminController');

router.get('/dashboard', a.requireAdmin, a.dashboard);

router.get('/flights', a.requireAdmin, a.flights);
router.get('/flights/add', a.requireAdmin, a.showAddFlight);
router.post('/flights/add', a.requireAdmin, a.addFlight);
router.get('/flights/edit/:id', a.requireAdmin, a.showEditFlight);
router.post('/flights/edit/:id', a.requireAdmin, a.updateFlight);
router.get('/flights/delete/:id', a.requireAdmin, a.deleteFlight);

router.get('/airports', a.requireAdmin, a.airports);
router.get('/airports/add', a.requireAdmin, a.showAddAirport);
router.post('/airports/add', a.requireAdmin, a.addAirport);
router.get('/airports/edit/:id', a.requireAdmin, a.showEditAirport);
router.post('/airports/edit/:id', a.requireAdmin, a.updateAirport);
router.get('/airports/delete/:id', a.requireAdmin, a.deleteAirport);

router.get('/users', a.requireAdmin, a.users);
router.get('/bookings', a.requireAdmin, a.bookings);
router.get('/reports', a.requireAdmin, a.reports);

module.exports = router;
