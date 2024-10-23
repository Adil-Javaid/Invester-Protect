const express = require("express");
const router = express.Router();
const Investor = require("../Schema/InvestorSchema");

router.post("/create", async (req, res) => {
  const { name, email, investorId} = req.body;

  // Check if all required fields are provided
  if (!name || !email || !investorId) {
    return res
      .status(400)
      .json({ message: "Name, email, and investorId are required." });
  }

  try {
    // Check if an investor with the given email or investorId already exists
    let investor = await Investor.findOne({
      $or: [{ email }, { _id: investorId }],
    });

    if (investor) {
      return res
        .status(400)
        .json({ message: "Investor with this email or ID already exists." });
    }

    // Create and save the new investor with hashed password
    investor = new Investor({
      _id: investorId,
      name,
      email,
      tokenPurchased: 0,
    });

    await investor.save();
    res.status(201).json(investor);
  } catch (error) {
    console.error("Error creating investor:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not create investor." });
  }
});

module.exports = router;
