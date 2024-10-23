import React, { useState } from "react";
import { generateBonusCode } from "../../Services/bonusService";
import "./bonuscodeform.css";
import axios from "axios";

const BonusCodeForm: React.FC = () => {
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [tokenPrice, setTokenPrice] = useState<number>(1);
  const [tokenCount, setTokenCount] = useState<number>(15); // Number of tokens to generate
  const [message, setMessage] = useState<string>(""); // State for confirmation message
  const [showMessage, setShowMessage] = useState<boolean>(false); // State to control visibility of message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateBonusCode(
        discountPercentage,
        expirationDate,
        tokenPrice,
        tokenCount
      );
      setMessage(
        "Bonus codes with the specified tokens have been generated successfully."
      );
      setShowMessage(true); // Show the message
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        setMessage(
          `Error: ${
            error.response?.data.message || "Error generating bonus code."
          }`
        );
        setShowMessage(true); // Show the message
      } else {
        console.error("Error:", error);
        setMessage("An unexpected error occurred.");
        setShowMessage(true); // Show the message
      }
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false); // Close the message
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bonus-form">
          <label>Discount Percentage</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            min={1}
            max={100}
            required
          />
        </div>
        <div className="bonus-form">
          <label>Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>
        <div className="bonus-form">
          <label>Token Price</label>
          <input
            type="number"
            value={tokenPrice}
            onChange={(e) => setTokenPrice(Number(e.target.value))}
            min={1}
            required
          />
        </div>
        <div className="bonus-form">
          <label>Number of Tokens</label>
          <input
            type="number"
            value={tokenCount}
            onChange={(e) => setTokenCount(Number(e.target.value))}
            min={1}
            required
          />
        </div>
        <button type="submit">Generate Bonus Code</button>
      </form>
      {showMessage && (
        <div className="confirmation-message">
          {message}
          <button className="close-button" onClick={handleCloseMessage}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default BonusCodeForm;
