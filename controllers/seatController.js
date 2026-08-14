const Seat = require('../models/seatModel');
const Flight = require('../models/flightModel');

exports.showSeats = async (req, res) => {
  const flight = await Flight.findById(req.params.flightId);
  if (!flight) { req.session.error = 'Flight not found'; return res.redirect('/passenger/search'); }
  let seats = await Seat.getByFlight(flight.id);
  if (seats.length === 0) {
    await Seat.createSeatsForFlight(flight.id, flight.total_seats);
    seats = await Seat.getByFlight(flight.id);
  }
  res.render('passenger/seat-selection', { title: 'Select Seat', flight, seats });
};
