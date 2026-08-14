const Flight = require('../models/flightModel');
const Airport = require('../models/airportModel');

exports.flightDetails = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) { req.session.error = 'Flight not found'; return res.redirect('/passenger/search'); }
    res.render('passenger/flight-details', { title: 'Flight Details', flight });
  } catch (e) { console.error(e); req.session.error = 'Error loading flight'; res.redirect('/passenger/search'); }
};

// Show ALL available flights (no search required)
exports.allFlights = async (req, res) => {
  try {
    const flights = await Flight.getAll();
    const airports = await Airport.getAll();
    res.render('passenger/all-flights', { title: 'All Available Flights', flights, airports });
  } catch (e) { console.error(e); req.session.error = 'Error loading flights'; res.redirect('/passenger/dashboard'); }
};
