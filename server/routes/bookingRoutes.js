const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();


// ================= CREATE BOOKING =================
// Only renter can book
router.post('/create', protect, authorizeRoles('renter'), async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newBooking = new Booking({
      propertyId,
      userId: req.user._id,
      ownerId: property.userId,
      username: req.user.name
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking request sent successfully",
      booking: newBooking
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// ================= OWNER VIEW BOOKINGS =================
router.get('/owner', protect, authorizeRoles('owner'), async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('propertyId')
      .populate('userId', 'name email');

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// ================= UPDATE BOOKING STATUS =================
router.put('/update/:id', protect, authorizeRoles('owner'), async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking status updated",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
