const User = require('../models/userModel');

exports.showLogin = (req, res) => res.render('auth/login', { title: 'Login' });
exports.showRegister = (req, res) => res.render('auth/register', { title: 'Register' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      req.session.error = 'All required fields must be filled';
      return res.redirect('/register');
    }
    if (await User.findByEmail(email)) {
      req.session.error = 'Email already registered';
      return res.redirect('/register');
    }
    await User.create({ name, email, password, phone });
    req.session.success = 'Registration successful! Please sign in.';
    res.redirect('/login');
  } catch (e) { console.error(e); req.session.error = 'Something went wrong'; res.redirect('/register'); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || user.role !== 'passenger' || !(await User.comparePassword(password, user.password))) {
      req.session.error = 'Invalid email or password';
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.redirect('/passenger/dashboard');
  } catch (e) { console.error(e); req.session.error = 'Login failed'; res.redirect('/login'); }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || user.role !== 'admin' || !(await User.comparePassword(password, user.password))) {
      req.session.error = 'Invalid admin credentials';
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.redirect('/admin/dashboard');
  } catch (e) { console.error(e); req.session.error = 'Login failed'; res.redirect('/login'); }
};

exports.logout = (req, res) => req.session.destroy(() => res.redirect('/login'));
