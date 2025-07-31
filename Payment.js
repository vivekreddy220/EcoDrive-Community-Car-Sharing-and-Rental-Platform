const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  cardNumber: String,
  expDate: String,
  cvv: String,
  price: Number
});

module.exports = mongoose.model('Payment', paymentSchema);
