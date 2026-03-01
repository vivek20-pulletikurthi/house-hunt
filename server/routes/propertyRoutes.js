const express = require("express");
const Property = require("../models/property");

const router = express.Router();

/* ADD PROPERTY */
router.post("/add", async (req, res) => {
  try {
    const {
      propType,
      address,
      amount,
      additionalInfo,
      contact,
      ownerId
    } = req.body;

    if (
      !propType ||
      !address ||
      !amount ||
      !additionalInfo ||
      !contact ||
      !ownerId
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newProperty = await Property.create({
      propType,
      address,
      amount,
      additionalInfo,
      contact,
      ownerId
    });

    res.json({
      message: "Property added successfully",
      property: newProperty
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* OWNER PROPERTIES */
router.get("/owner/:ownerId", async (req, res) => {
  const properties = await Property.find({ ownerId: req.params.ownerId });
  res.json(properties);
});

/* ALL PROPERTIES */
router.get("/all", async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

module.exports = router;