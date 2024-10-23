import React, { useState, useEffect } from "react";
import "./TokenPurchase.css";
const token = "9b1f5e5a7d2e3d5e6b7a2c9d4a7b8e1c8f6d5e2c3f8e7a6c9b4f3a2c1d9e4f5";

const TokenPurchase: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [bonusCode, setBonusCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [bonusCodesData, setBonusCodesData] = useState<any[]>([]);
  const [tokenOptions, setTokenOptions] = useState<any[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);
  const [usedBonusCodes, setUsedBonusCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Track which option is selected
  const [showAllBonusCodes, setShowAllBonusCodes] = useState<boolean>(false);
  const [showTokenPurchase, setShowTokenPurchase] = useState<boolean>(true); // Show token purchase by default

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Show 6 tokens per page

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bonus/all", {
        method: "GET", // Explicitly define the method
        headers: {
          "Authorization": `Bearer ${token}`, // Added Authorization header
          "Content-Type": "application/json"  // Optional: Include if needed
        },
      });
      const data = await response.json();
      setBonusCodesData(data);
      setTokenOptions(
        data.map((bonus: any) => ({
          _id: bonus._id,
          code: bonus.code,
          price: bonus.tokenPrice,
        }))
      );
    } catch (error) {
      console.error("Error fetching bonus codes:", error);
      setError("Failed to fetch bonus codes.");
    }
  };

  const handleCreateAccount = async () => {
    const id = `investor-123`;
    setInvestorId(id);

    try {
      const response = await fetch(
        "http://localhost:8000/api/investor/create",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Investor Name",
            email: "email@example.com",
            investorId: id,
          }),
        }
      );

      if (response.ok) {
        setMessage(`Account created! Your Investor ID: ${id}`);
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage("Failed to create account.");
    }
  };

  const handleBonusCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBonusCode(e.target.value);
    validateBonusCode(e.target.value);
  };

  const validateBonusCode = (code: string) => {
    const bonusCodeEntry = bonusCodesData.find((b) => b.code === code);
    const currentDate = new Date();

    if (
      bonusCodeEntry &&
      bonusCodeEntry.active &&
      new Date(bonusCodeEntry.expirationDate) > currentDate
    ) {
      setDiscount(bonusCodeEntry.discountPercentage);
      setError("");
    } else {
      setDiscount(0);
      setError("Invalid, expired, or deactivated bonus code.");
    }
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId);
    setBonusCode("");
    setDiscount(0);
    setError("");
  };

  const handlePurchase = async () => {
    if (!investorId || !selectedToken || purchaseAmount <= 0) {
      setError(
        "Please create an account, select a token, and enter a valid amount."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/bonus/apply", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId,
          code: bonusCode,
          tokenAmount: purchaseAmount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUsedBonusCodes((prev) => [...prev, bonusCode]);
        setMessage(
          `Purchase successful! You bought tokens: ${data.finalTokenAmount}`
        );
        resetPurchaseForm();
      } else {
        setError(data.message || "Purchase failed.");
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      setError("Failed to make purchase.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPurchaseForm = () => {
    setSelectedToken(null);
    setPurchaseAmount(100); // Reset to default
    setBonusCode("");
    setDiscount(0);
  };

  const calculateTotalTokens = () => {
    const bonusTokens = (purchaseAmount * discount) / 100;
    return purchaseAmount + bonusTokens;
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleShowAllBonusCodes = () => {
    setShowAllBonusCodes(true);
    setShowTokenPurchase(false); // Hide token purchase section
  };

  const handleShowTokenPurchase = () => {
    setShowTokenPurchase(true);
    setShowAllBonusCodes(false); // Hide bonus codes section
  };

  // Pagination handling with previous and next buttons
  const handlePageChange = (direction: string) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(tokenOptions.length / itemsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTokenOptions = tokenOptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="token-purchase-page">
      {/* Top navigation (acts as sidebar but at top) */}
      <div className="top-nav">
        <ul>
          <li
            className={showAllBonusCodes ? "active" : ""}
            onClick={handleShowAllBonusCodes}
          >
            Show All Bonus Codes
          </li>
          <li
            className={showTokenPurchase ? "active" : ""}
            onClick={handleShowTokenPurchase}
          >
            Token Purchase by User
          </li>
        </ul>
      </div>

      <div className="content">
        <header>
          <h1>Token Purchase Portal</h1>
          <p>Get exclusive tokens with bonus discounts!</p>
        </header>

        {showAllBonusCodes && (
          <section className="bonus-code-list">
            <h2>All Bonus Codes</h2>
            <ul>
              {bonusCodesData.map((bonus) => (
                <li key={bonus._id}>
                  Code: {bonus.code}, Discount: {bonus.discountPercentage}%
                </li>
              ))}
            </ul>
          </section>
        )}

        {showTokenPurchase && (
          <>
            <section className="account-section">
              {!investorId && (
                <div className="create-account">
                  <h3>Login to see Tokens</h3>
                  <button className="primary-btn" onClick={handleCreateAccount}>
                    Login
                  </button>
                </div>
              )}
              {investorId && (
                <p className="investor-id">Investor ID: {investorId}</p>
              )}
            </section>

            {investorId && (
              <section className="purchase-section">
                <h2>Purchase Tokens</h2>
                <div className="token-list">
                  {currentTokenOptions.map((token) => (
                    <div className="token-card" key={token._id}>
                      <div className="token-details">
                        <h3>Bonus Code: {token.code}</h3>
                        <p>Price: {token.price} USD</p>
                      </div>
                      <button
                        className="primary-btn"
                        onClick={() => handleTokenSelection(token._id)}
                      >
                        Select Token
                      </button>

                      {selectedToken === token._id && (
                        <div className="purchase-form">
                          <div className="form-group">
                            <label>Number of Tokens: {purchaseAmount}</label>
                          </div>
                          <div className="form-group bonus-input">
                            <label htmlFor="bonus-code">Bonus Code</label>
                            <input
                              id="bonus-code"
                              type="text"
                              value={bonusCode}
                              onChange={handleBonusCodeChange}
                            />
                          </div>
                          <p>Total Tokens: {calculateTotalTokens()}</p>
                          <button
                            className="primary-btn"
                            onClick={handlePurchase}
                            disabled={isLoading}
                          >
                            {isLoading ? "Processing..." : "Purchase"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange("next")}
                    disabled={
                      currentPage === Math.ceil(tokenOptions.length / itemsPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* Centered message popup */}
        {message && (
          <div className="message-popup bottom-center">
            <p>{message}</p>
            <button className="close-btn" onClick={handleCloseMessage}>
              Close
            </button>
          </div>
        )}

        {/* Centered error message */}
        {error && (
          <div className="error-popup bottom-center">
            <p>{error}</p>
            <button className="close-btn" onClick={() => setError("")}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPurchase;
