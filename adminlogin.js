const express = require('express');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const router = express.Router();

router.get('/', async (req, res) => {
  const userEmail = req.session.email;
  if (!userEmail) return res.redirect('/login');

  const booking = await Booking.findOne({ userEmail }).sort({ _id: -1 });
  if (!booking) return res.send('No booking found');

  req.session.bookingId = booking._id;

  res.render('payment', {
    price: booking.price,
    bookingId: booking._id
  });
});

router.post('/', async (req, res) => {
  try {
    const { cardno, exp, cvv } = req.body;
    const bookingId = req.session.bookingId;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(400).send('Invalid booking');

    if (!cardno || !exp || !cvv) {
      return res.status(400).send('Please fill all fields');
    }

    const payment = new Payment({
      bookingId,
      cardNumber: cardno,
      expDate: exp,
      cvv,
      price: booking.price
    });

    await payment.save();
    res.redirect('/success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Payment failed');
  }
});

module.exports = router;
