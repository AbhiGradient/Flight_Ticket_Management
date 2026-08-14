const Flight = require('../models/flightModel');
const Airport = require('../models/airportModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Seat = require('../models/seatModel');

exports.requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.session.error = 'Admin access required';
  res.redirect('/login');
};

exports.dashboard = async (req, res) => {
  try {
    const [usersCount, flightsCount, bookingsCount, airportsCount, revenue, recentBookings] = await Promise.all([
      User.count(), Flight.count(), Booking.count(), Airport.count(), Booking.getRevenue(), Booking.getRecentBookings(5)
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { usersCount, flightsCount, bookingsCount, airportsCount, revenue },
      recentBookings
    });
  } catch (e) { console.error(e); res.render('admin/dashboard', { title: 'Admin Dashboard', stats: {}, recentBookings: [] }); }
};

// ============ FLIGHTS ============
exports.flights = async (req, res) => {
  try {
    const flights = await Flight.getAll();
    res.render('admin/flights', { title: 'Manage Flights', flights });
  } catch (e) { console.error(e); req.session.error = 'Error loading flights'; res.redirect('/admin/dashboard'); }
};

exports.showAddFlight = async (req, res) => {
  try {
    const airports = await Airport.getAll();
    res.render('admin/add-flight', { title: 'Add Flight', airports });
  } catch (e) { console.error(e); req.session.error = 'Error'; res.redirect('/admin/flights'); }
};

exports.addFlight = async (req, res) => {
  try {
    const data = {
      flight_number: req.body.flight_number,
      airline: req.body.airline,
      source_airport_id: req.body.source_airport_id,
      destination_airport_id: req.body.destination_airport_id,
      departure_time: req.body.departure_time,
      arrival_time: req.body.arrival_time,
      duration: req.body.duration,
      price: parseFloat(req.body.price),
      total_seats: parseInt(req.body.total_seats) || 60,
      status: 'active'
    };
    if (data.source_airport_id === data.destination_airport_id) {
      req.session.error = 'Source and destination cannot be the same';
      return res.redirect('/admin/flights/add');
    }
    const flightId = await Flight.create(data);
    await Seat.createSeatsForFlight(flightId, data.total_seats);
    req.session.success = 'Flight added successfully';
    res.redirect('/admin/flights');
  } catch (e) {
    console.error('Add flight error:', e);
    req.session.error = 'Failed: ' + (e.code === 'ER_DUP_ENTRY' ? 'Flight number already exists' : e.message);
    res.redirect('/admin/flights/add');
  }
};

exports.showEditFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    const airports = await Airport.getAll();
    if (!flight) { req.session.error = 'Flight not found'; return res.redirect('/admin/flights'); }
    res.render('admin/edit-flight', { title: 'Edit Flight', flight, airports });
  } catch (e) { console.error(e); res.redirect('/admin/flights'); }
};

exports.updateFlight = async (req, res) => {
  try {
    const data = {
      flight_number: req.body.flight_number,
      airline: req.body.airline,
      source_airport_id: req.body.source_airport_id,
      destination_airport_id: req.body.destination_airport_id,
      departure_time: req.body.departure_time,
      arrival_time: req.body.arrival_time,
      duration: req.body.duration,
      price: parseFloat(req.body.price),
      total_seats: parseInt(req.body.total_seats) || 60,
      status: req.body.status || 'active'
    };
    await Flight.update(req.params.id, data);
    req.session.success = 'Flight updated successfully';
    res.redirect('/admin/flights');
  } catch (e) {
    console.error('Update flight error:', e);
    req.session.error = 'Update failed: ' + (e.code === 'ER_DUP_ENTRY' ? 'Flight number already exists' : e.message);
    res.redirect('/admin/flights/edit/' + req.params.id);
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    await Flight.delete(req.params.id);
    req.session.success = 'Flight deleted';
    res.redirect('/admin/flights');
  } catch (e) {
    console.error('Delete flight error:', e);
    req.session.error = 'Delete failed: ' + e.message;
    res.redirect('/admin/flights');
  }
};

// ============ AIRPORTS ============
exports.airports = async (req, res) => {
  try {
    const airports = await Airport.getAll();
    res.render('admin/airports', { title: 'Manage Airports', airports });
  } catch (e) { console.error(e); req.session.error = 'Error'; res.redirect('/admin/dashboard'); }
};

exports.showAddAirport = (req, res) => res.render('admin/add-airport', { title: 'Add Airport' });

exports.addAirport = async (req, res) => {
  try {
    await Airport.create({ code: req.body.code.toUpperCase(), name: req.body.name, city: req.body.city, country: req.body.country });
    req.session.success = 'Airport added';
    res.redirect('/admin/airports');
  } catch (e) {
    req.session.error = 'Failed: ' + (e.code === 'ER_DUP_ENTRY' ? 'Airport code already exists' : e.message);
    res.redirect('/admin/airports/add');
  }
};

exports.showEditAirport = async (req, res) => {
  try {
    const airport = await Airport.findById(req.params.id);
    res.render('admin/edit-airport', { title: 'Edit Airport', airport });
  } catch (e) { res.redirect('/admin/airports'); }
};

exports.updateAirport = async (req, res) => {
  try {
    await Airport.update(req.params.id, { code: req.body.code.toUpperCase(), name: req.body.name, city: req.body.city, country: req.body.country });
    req.session.success = 'Airport updated';
    res.redirect('/admin/airports');
  } catch (e) {
    req.session.error = 'Update failed: ' + e.message;
    res.redirect('/admin/airports/edit/' + req.params.id);
  }
};

exports.deleteAirport = async (req, res) => {
  try {
    await Airport.delete(req.params.id);
    req.session.success = 'Airport deleted';
    res.redirect('/admin/airports');
  } catch (e) {
    req.session.error = 'Cannot delete: airport is used in flights';
    res.redirect('/admin/airports');
  }
};

exports.users = async (req, res) => {
  try { const users = await User.getAll(); res.render('admin/users', { title: 'Users', users }); }
  catch (e) { res.redirect('/admin/dashboard'); }
};

exports.bookings = async (req, res) => {
  try { const bookings = await Booking.getAll(); res.render('admin/bookings', { title: 'Bookings', bookings }); }
  catch (e) { res.redirect('/admin/dashboard'); }
};

exports.reports = async (req, res) => {
  try {
    const [totalRevenue, totalBookings, allBookings] = await Promise.all([
      Booking.getRevenue(), Booking.count(), Booking.getAll()
    ]);
    const routeStats = {};
    allBookings.forEach(b => {
      if (b.status !== 'confirmed') return;
      const key = `${b.source_city} → ${b.dest_city}`;
      if (!routeStats[key]) routeStats[key] = { count: 0, revenue: 0 };
      routeStats[key].count++;
      routeStats[key].revenue += parseFloat(b.total_amount);
    });
    res.render('admin/reports', { title: 'Reports', stats: { totalRevenue, totalBookings }, routeStats: Object.entries(routeStats) });
  } catch (e) { console.error(e); res.redirect('/admin/dashboard'); }
};
