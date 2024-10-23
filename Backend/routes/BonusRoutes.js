const express = require("express");
const {
  generateBonusCode,
  getAllBonusCodes,
  toggleBonusCodeStatus,
  applyBonusCode,
  bonusHistory,
} = require("../controller/BonusController");

const { authenticateToken } = require("../middleware/authToken"); // Your middleware

const router = express.Router();

router.post("/generate", authenticateToken, generateBonusCode);
router.get("/all", authenticateToken, getAllBonusCodes);
router.post("/toggle", authenticateToken, toggleBonusCodeStatus);
router.post("/apply", authenticateToken, applyBonusCode);
router.get("/investors/:investorId/bonus-history", authenticateToken, bonusHistory);


module.exports = router;
