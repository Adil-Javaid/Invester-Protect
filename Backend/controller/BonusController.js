const BonusCode = require('../Schema/BoneSchema');
const Investor = require('../Schema/InvestorSchema');
const Admin = require("../Schema/AdminSchema"); // Define your Admin schema

exports.signupAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin account already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Create new admin
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin account created successfully." });
  } catch (error) {
    console.error("Error creating admin account:", error);
    res.status(500).json({ message: "Error creating admin account." });
  }
};
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Instead of finding the admin by username, skip this check
    // Just return a success message for any username/password
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Return a success message without validating credentials
    res.json({ message: "Login successful." });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.generateBonusCode = async (req, res) => {
  try {
    const { discountPercentage, expirationDate, tokenPrice, tokenCount } =
      req.body;

    if (!discountPercentage || !expirationDate || !tokenPrice || !tokenCount) {
      return res.status(400).json({
        message:
          "Please provide all required fields: discountPercentage, expirationDate, tokenPrice, tokenCount",
      });
    }

    const generatedCodes = [];

    for (let i = 0; i < tokenCount; i++) {
      const code = Math.random().toString(36).substring(2, 18).toUpperCase();

      generatedCodes.push({
        code,
        discountPercentage,
        expirationDate,
        tokenPrice,
        tokenCount, // Save token count in each code
      });
    }

    const insertedCodes = await BonusCode.insertMany(generatedCodes);

    res.status(201).json({
      message: `${tokenCount} bonus codes generated successfully.`,
      codes: insertedCodes,
    });
  } catch (error) {
    console.error("Error generating bonus codes:", error);
    res.status(500).json({
      message: "An error occurred while generating bonus codes.",
    });
  }
};




exports.getAllBonusCodes = async (req, res) => {
  const currentDate = new Date();
  const bonusCodes = await BonusCode.find({
    expirationDate: { $gte: currentDate },
  })
    .populate("deactivatedBy", "name")
    .exec();

  res.json(bonusCodes);
};

exports.toggleBonusCodeStatus = async (req, res) => {
  const { codeId, active } = req.body;

  try {
    const bonusCode = await BonusCode.findByIdAndUpdate(
      codeId,
      { active: active },
      { new: true }
    );

    if (!bonusCode) {
      return res.status(404).json({ message: "Bonus code not found." });
    }

    res.json({
      message: `Bonus code ${
        active ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (error) {
    console.error("Error toggling bonus code status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.applyBonusCode = async (req, res) => {
  try {
    const { investorId, code, tokenAmount } = req.body;

    if (!investorId || !code || tokenAmount <= 0) {
      return res.status(400).json({
        message:
          "Invalid request. Ensure investorId, code, and valid tokenAmount are provided.",
      });
    }

    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(400).json({ message: "Investor not found." });
    }

    const bonusCode = await BonusCode.findOne({ code, active: true });
    if (!bonusCode) {
      return res
        .status(400)
        .json({ message: "Invalid or inactive bonus code." });
    }

    // Calculate bonus tokens
    const bonusTokens = (tokenAmount * bonusCode.discountPercentage) / 100;
    const totalTokens = tokenAmount + bonusTokens;

    // Update investor's token count and mark bonus code as used
    investor.tokenPurchased += totalTokens;
    investor.bonusCodesUsed.push(bonusCode._id);
    bonusCode.usedBy.push(investor._id);
    bonusCode.active = false; // Deactivate the bonus code after use

    await investor.save();
    await bonusCode.save();

    res.json({ message: "Purchase successful", totalTokens });
  } catch (error) {
    console.error("Error applying bonus code:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not apply bonus code." });
  }
};

// exports.bonusHistory = async (req, res) => {
//   const { codeId } = req.params;
//   const bonusCode = await BonusCode.findById(codeId).populate(
//     "usedBy",
//     "name email"
//   );
//   res.json(bonusCode);
// };

exports.bonusHistory = async (req, res) => {
  const investorId = req.params.investorId;

  try {
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    const bonusCodesUsed = investor.bonusCodesUsed;
    const bonusCodeHistory = await BonusCode.find({
      _id: { $in: bonusCodesUsed },
    });

    res.json(bonusCodeHistory);
  } catch (error) {
    console.error("Error fetching bonus code history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


