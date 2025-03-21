import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Gift,
  LogIn,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

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
  const [showAllBonusCodes, setShowAllBonusCodes] = useState<boolean>(false);
  const [showTokenPurchase, setShowTokenPurchase] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/bonus/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBonusCodesData(data);
      setTokenOptions(
        data.map((bonus: any) => ({
          _id: bonus._id,
          code: bonus.code,
          price: bonus.tokenPrice,
          discountPercentage: bonus.discountPercentage,
        }))
      );
    } catch (error) {
      console.error("Error fetching bonus codes:", error);
      setError("Failed to fetch bonus codes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    const id = `investor-${Math.floor(Math.random() * 10000)}`;

    try {
      const response = await fetch(
        "http://localhost:8000/api/investor/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Investor Name",
            email: "email@example.com",
            investorId: id,
          }),
        }
      );

      if (response.ok) {
        setInvestorId(id);
        setMessage(`Welcome! Your Investor ID: ${id}`);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setError("Failed to create account.");
    } finally {
      setIsLoading(false);
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
    } else if (code.length > 0) {
      setDiscount(0);
      setError("Invalid, expired, or deactivated bonus code.");
    } else {
      setDiscount(0);
      setError("");
    }
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId === selectedToken ? null : tokenId);
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
          `Purchase successful! You bought ${data.finalTokenAmount} tokens.`
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
    setPurchaseAmount(100);
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
    setShowTokenPurchase(false);
  };

  const handleShowTokenPurchase = () => {
    setShowTokenPurchase(true);
    setShowAllBonusCodes(false);
  };

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

  const handleAmountChange = (change: number) => {
    const newAmount = Math.max(10, purchaseAmount + change);
    setPurchaseAmount(newAmount);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTokenOptions = tokenOptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Navigation Tabs */}
      <div className="mx-auto max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
              showTokenPurchase
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={handleShowTokenPurchase}
          >
            <CreditCard className="inline-block mr-2 h-5 w-5" /> Purchase Tokens
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
              showAllBonusCodes
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={handleShowAllBonusCodes}
          >
            <Gift className="inline-block mr-2 h-5 w-5" /> Available Bonus Codes
          </button>
        </div>

        <div className="p-6">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Token Purchase Portal
            </h1>
            <p className="text-gray-600">
              Invest in exclusive tokens with special bonus opportunities
            </p>
          </header>

          {isLoading && !message && !error && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {showAllBonusCodes && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Available Bonus Codes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bonusCodesData.map((bonus) => (
                  <div
                    key={bonus._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100"
                  >
                    <div>
                      <span className="block text-lg font-medium text-gray-800">
                        {bonus.code}
                      </span>
                      <span className="text-indigo-600 font-bold">
                        {bonus.discountPercentage}% Bonus
                      </span>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm text-indigo-700 shadow-sm">
                      ${bonus.tokenPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showTokenPurchase && (
            <>
              {!investorId ? (
                <div className="bg-white p-8 rounded-xl text-center">
                  <div className="max-w-md mx-auto">
                    <LogIn className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Sign In to Purchase Tokens
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Login to your account to access exclusive token offerings
                      with special bonuses
                    </p>
                    <button
                      className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                      onClick={handleCreateAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                          Processing...
                        </span>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Select Token to Purchase
                    </h2>
                    <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-medium">
                      Investor ID: {investorId}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentTokenOptions.map((token) => (
                      <div
                        key={token._id}
                        className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg ${
                          selectedToken === token._id
                            ? "ring-2 ring-indigo-500"
                            : ""
                        }`}
                      >
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-3">
                          <h3 className="text-white font-semibold tracking-wide">
                            Token {token.code}
                          </h3>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-gray-600">Base Price</div>
                            <div className="text-xl font-bold text-gray-800">
                              ${token.price}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-6">
                            <div className="text-gray-600">Discount</div>
                            <div className="text-lg font-medium text-green-600">
                              {token.discountPercentage}%
                            </div>
                          </div>
                          <button
                            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                              selectedToken === token._id
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                            onClick={() => handleTokenSelection(token._id)}
                          >
                            {selectedToken === token._id
                              ? "Selected"
                              : "Select Token"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tokenOptions.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-4 my-6">
                      <button
                        onClick={() => handlePageChange("prev")}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-indigo-600 hover:bg-indigo-100"
                        }`}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <span className="text-gray-700">
                        Page {currentPage} of{" "}
                        {Math.ceil(tokenOptions.length / itemsPerPage)}
                      </span>
                      <button
                        onClick={() => handlePageChange("next")}
                        disabled={
                          currentPage ===
                          Math.ceil(tokenOptions.length / itemsPerPage)
                        }
                        className={`p-2 rounded-full ${
                          currentPage ===
                          Math.ceil(tokenOptions.length / itemsPerPage)
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-indigo-600 hover:bg-indigo-100"
                        }`}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  )}

                  {selectedToken && (
                    <div className="bg-white rounded-xl p-6 shadow-md mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Purchase Details
                      </h3>

                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Token Amount
                        </label>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleAmountChange(-10)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={purchaseAmount}
                            onChange={(e) =>
                              setPurchaseAmount(
                                Math.max(10, parseInt(e.target.value) || 0)
                              )
                            }
                            className="text-center flex-1 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-0"
                          />
                          <button
                            onClick={() => handleAmountChange(10)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Bonus Code (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={bonusCode}
                            onChange={handleBonusCodeChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter bonus code"
                          />
                          {discount > 0 && (
                            <div className="absolute right-3 top-2">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                +{discount}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Base Amount:</span>
                          <span className="font-medium">
                            {purchaseAmount} Tokens
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              Bonus ({discount}%):
                            </span>
                            <span className="font-medium text-green-600">
                              +{(purchaseAmount * discount) / 100} Tokens
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                          <span className="text-gray-800 font-semibold">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-indigo-700">
                            {calculateTotalTokens()} Tokens
                          </span>
                        </div>
                      </div>

                      <button
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                        onClick={handlePurchase}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                            Processing...
                          </span>
                        ) : (
                          <span>Complete Purchase</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message Notification */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-start max-w-md">
          <Check className="h-6 w-6 mr-3 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p>{message}</p>
          </div>
          <button
            onClick={handleCloseMessage}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg flex items-start max-w-md">
          <AlertCircle className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p>{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenPurchase;
