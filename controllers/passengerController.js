const User = require('../models/userModel');
const Airport = require('../models/airportModel');
const Booking = require('../models/bookingModel');
const Flight = require('../models/flightModel');

exports.dashboard = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.session.user.id);
    res.render('passenger/dashboard', {
      title: 'Dashboard',
      bookings: bookings.slice(0, 3),
      total: bookings.length
    });
  } catch (e) {
    console.error('Dashboard error:', e);
    res.render('passenger/dashboard', { title: 'Dashboard', bookings: [], total: 0 });
  }
};

exports.showSearch = async (req, res) => {
  try {
    const airports = await Airport.getAll();
    res.render('passenger/search-flights', { title: 'Search Flights', airports, flights: null, search: null });
  } catch (e) { console.error(e); req.session.error = 'Error loading search'; res.redirect('/passenger/dashboard'); }
};

exports.searchFlights = async (req, res) => {
  try {
    const { source, destination, date } = req.body;
    if (!source || !destination || !date) {
      req.session.error = 'Please fill all fields';
      return res.redirect('/passenger/search');
    }
    if (source === destination) {
      req.session.error = 'Source and destination cannot be the same';
      return res.redirect('/passenger/search');
    }
    const flights = await Flight.search(source, destination, date);
    const airports = await Airport.getAll();
    res.render('passenger/search-flights', { title: 'Results', airports, flights, search: { source, destination, date } });
  } catch (e) {
    console.error('Search error:', e);
    req.session.error = 'Search failed';
    res.redirect('/passenger/search');
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('passenger/profile', { title: 'My Profile', user });
  } catch (e) { console.error(e); req.session.error = 'Error loading profile'; res.redirect('/passenger/dashboard'); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await User.update(req.session.user.id, { name, email, phone });
    req.session.user.name = name;
    req.session.user.email = email;
    req.session.success = 'Profile updated successfully';
    res.redirect('/passenger/profile');
  } catch (e) { console.error(e); req.session.error = 'Update failed'; res.redirect('/passenger/profile'); }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.session.user.id);
    res.render('passenger/my-bookings', { title: 'My Bookings', bookings });
  } catch (e) { console.error(e); req.session.error = 'Error loading bookings'; res.redirect('/passenger/dashboard'); }
};

exports.bookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user_id !== req.session.user.id) {
      req.session.error = 'Booking not found';
      return res.redirect('/passenger/my-bookings');
    }
    const passengers = await Booking.getPassengers(booking.id);
    res.render('passenger/booking-details', { title: 'Booking Details', booking, passengers });
  } catch (e) { console.error(e); req.session.error = 'Error loading details'; res.redirect('/passenger/my-bookings'); }
};
