const Booking = require('../models/bookingModel');
const Passenger = require('../models/passengerModel');
const Payment = require('../models/paymentModel');
const Seat = require('../models/seatModel');
const Flight = require('../models/flightModel');

exports.showPassengerDetails = async (req, res) => {
  try {
    const { flightId, seatId } = req.query;
    const flight = await Flight.findById(flightId);
    const seat = await Seat.findById(seatId);
    if (!flight || !seat || !seat.is_available) {
      req.session.error = 'Invalid seat selection';
      return res.redirect('/passenger/search');
    }
    res.render('passenger/passenger-details', { title: 'Passenger Details', flight, seat, data: {} });
  } catch (e) { console.error(e); req.session.error = 'Error'; res.redirect('/passenger/search'); }
};

exports.savePassengerDetails = (req, res) => {
  try {
    const { flightId, seatId, name, age, gender, email, phone, journey_date, amount } = req.body;
    req.session.tempBooking = {
      flightId, seatId, name, age, gender, email, phone, journey_date,
      amount: parseFloat(amount)
    };
    res.redirect('/booking/payment');
  } catch (e) { console.error(e); res.redirect('/passenger/search'); }
};

exports.showPayment = (req, res) => {
  if (!req.session.tempBooking) {
    req.session.error = 'Session expired. Please start again.';
    return res.redirect('/passenger/search');
  }
  res.render('passenger/payment', { title: 'Payment', booking: req.session.tempBooking });
};

exports.processPayment = async (req, res) => {
  try {
    const t = req.session.tempBooking;
    if (!t) { req.session.error = 'Session expired'; return res.redirect('/passenger/search'); }
    const { payment_method } = req.body;

    // 1. Create booking
    const { id: bookingId, pnr } = await Booking.create({
      user_id: req.session.user.id,
      flight_id: t.flightId,
      seat_id: t.seatId,
      journey_date: t.journey_date,
      total_amount: t.amount,
      status: 'pending'
    });

    // 2. Save passenger info
    await Passenger.create({
      booking_id: bookingId, name: t.name, age: t.age, gender: t.gender, email: t.email, phone: t.phone
    });

    // 3. Mark seat as booked
    await Seat.book(t.seatId, bookingId);
    await Flight.decrementSeats(t.flightId);

    // 4. Simulate payment (always success)
    const transactionId = 'TXN' + Date.now();
    await Payment.create({
      booking_id: bookingId, amount: t.amount, payment_method, transaction_id: transactionId, status: 'success'
    });

    // 5. Confirm booking
    await Booking.updateStatus(bookingId, 'confirmed');

    // 6. Save info for confirmation page
    const booking = await Booking.findById(bookingId);
    req.session.lastBooking = { booking, payment: { transaction_id: transactionId, payment_method, amount: t.amount } };
    delete req.session.tempBooking;

    res.redirect(`/booking/confirmation/${bookingId}`);
  } catch (e) {
    console.error('Payment error:', e);
    req.session.error = 'Payment failed: ' + e.message;
    res.redirect('/passenger/search');
  }
};

exports.confirmation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user_id !== req.session.user.id) {
      req.session.error = 'Booking not found';
      return res.redirect('/passenger/my-bookings');
    }
    const passengers = await Booking.getPassengers(booking.id);
    res.render('passenger/booking-confirmation', { title: 'Booking Confirmed', booking, passengers });
  } catch (e) { console.error(e); res.redirect('/passenger/my-bookings'); }
};

exports.cancel = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user_id !== req.session.user.id || booking.status === 'cancelled') {
      return res.redirect('/passenger/my-bookings');
    }
    await Booking.updateStatus(booking.id, 'cancelled');
    if (booking.seat_id) await Seat.release(booking.seat_id);
    await Flight.incrementSeats(booking.flight_id);
    req.session.success = 'Booking cancelled successfully';
    res.redirect('/passenger/my-bookings');
  } catch (e) {
    console.error('Cancel error:', e);
    req.session.error = 'Cancellation failed';
    res.redirect('/passenger/my-bookings');
  }
};
