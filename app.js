const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const Airport = require('./models/airportModel');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  delete req.session.error;
  delete req.session.success;
  next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/passenger', require('./routes/passengerRoutes'));
app.use('/flights', require('./routes/flightRoutes'));
app.use('/booking', require('./routes/bookingRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.get('/', async (req, res) => {
  try {
    const airports = await Airport.getAll();
    res.render('home', { title: 'Home', airports });
  } catch (e) {
    res.render('home', { title: 'Home', airports: [] });
  }
});

app.use((req, res) => res.status(404).render('404', { title: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✈ Server: http://localhost:${PORT}`));
