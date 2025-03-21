import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  AlertTriangle,
  Clock,
  Tag,
  Percent,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:8000/api";
const token = "9b1f5e5a7d2e3d5e6b7a2c9d4a7b8e1c8f6d5e2c3f8e7a6c9b4f3a2c1d9e4f5";

const BonusCodeHistory = ({ investorId }) => {
  const [bonusHistory, setBonusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [sortField, setSortField] = useState("expirationDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const fetchBonusHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/bonus/investors/${investorId}/bonus-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000, // 15 seconds timeout
        }
      );

      setBonusHistory(response.data);
    } catch (err) {
      console.error("API Error:", err);

      // Handle different error types
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Server might be unavailable.");
      } else if (err.response) {
        // Server responded with error status
        const statusCode = err.response.status;

        if (statusCode === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (statusCode === 403) {
          setError("You don't have permission to access this information.");
        } else if (statusCode === 404) {
          setError("No bonus history found for this investor.");
        } else if (statusCode >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(
            `Error: ${
              err.response.data.message || "Failed to fetch bonus history"
            }`
          );
        }
      } else if (err.request) {
        // Request made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusHistory();
  }, [investorId]);

  // Function to retry loading
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchBonusHistory();
  };

  // Function to handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate if a code is expired
  const isExpired = (expirationDate) => new Date(expirationDate) < new Date();

  // Calculate time remaining until expiration
  const getTimeRemaining = (expirationDate) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diff = expDate - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} left`;
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""} left`;
    }
  };

  // Filter and sort the data
  const processedData = bonusHistory
    .filter(
      (code) =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!showActiveOnly || code.active)
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortField === "expirationDate") {
        comparison = new Date(a.expirationDate) - new Date(b.expirationDate);
      } else if (
        sortField === "discountPercentage" ||
        sortField === "tokenPrice"
      ) {
        comparison = a[sortField] - b[sortField];
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
          <p className="text-purple-700 font-medium">
            Loading bonus history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg">
        <div className="flex items-start mb-4">
          <AlertTriangle
            className="text-red-500 mr-3 flex-shrink-0"
            size={24}
          />
          <div>
            <h3 className="text-lg font-semibold text-red-700">
              Error Loading Data
            </h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center"
          >
            <span>Retry</span>
            <span className="ml-1">({retryCount})</span>
          </button>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (bonusHistory.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center py-8">
          <Tag className="mx-auto mb-3 text-purple-500" size={36} />
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            No Bonus Codes Found
          </h3>
          <p className="text-purple-600 max-w-md mx-auto">
            This investor hasn't used any bonus codes yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 md:mb-0">
          <span>Bonus Code History</span>
          <span className="ml-2 text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
            {processedData.length}{" "}
            {processedData.length === 1 ? "code" : "codes"}
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={() => setShowActiveOnly(!showActiveOnly)}
                className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 border-purple-300"
              />
              <span className="ml-2 text-purple-700">Active only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-purple-200">
          <thead className="bg-purple-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={() => handleSort("code")}
              >
                <div className="flex items-center">
                  <Tag size={14} className="mr-1" />
                  <span>Code</span>
                  {sortField === "code" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={() => handleSort("discountPercentage")}
              >
                <div className="flex items-center">
                  <Percent size={14} className="mr-1" />
                  <span>Discount</span>
                  {sortField === "discountPercentage" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={() => handleSort("tokenPrice")}
              >
                <div className="flex items-center">
                  <DollarSign size={14} className="mr-1" />
                  <span>Token Price</span>
                  {sortField === "tokenPrice" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={() => handleSort("expirationDate")}
              >
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Expiration Date</span>
                  {sortField === "expirationDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  <span>Status</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {processedData.map((code) => {
              const expired = isExpired(code.expirationDate);
              const timeRemaining = getTimeRemaining(code.expirationDate);
              const expiringSoon =
                !expired &&
                timeRemaining.includes("day") &&
                parseInt(timeRemaining) < 7;

              return (
                <tr
                  key={code._id}
                  className={`hover:bg-purple-50 transition-colors ${
                    !code.active ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {code.discountPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${code.tokenPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">
                        {new Date(code.expirationDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`mt-1 text-xs flex items-center ${
                          expired
                            ? "text-red-600"
                            : expiringSoon
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        <Clock size={12} className="mr-1" />
                        {timeRemaining}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        !code.active
                          ? "bg-gray-100 text-gray-800"
                          : expired
                          ? "bg-red-100 text-red-800"
                          : expiringSoon
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {code.active ? (
                        <>
                          {expired ? (
                            <>
                              <XCircle size={12} className="mr-1" />
                              Expired
                            </>
                          ) : expiringSoon ? (
                            <>
                              <Clock size={12} className="mr-1" />
                              Expiring Soon
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} className="mr-1" />
                              Active
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No results message */}
      {processedData.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl mt-4">
          <span className="block mx-auto mb-2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <AlertTriangle className="text-purple-500" size={24} />
          </span>
          <h3 className="text-base font-medium text-purple-800">
            No matching bonus codes found
          </h3>
          <p className="text-sm text-purple-600 mt-1">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setShowActiveOnly(false);
            }}
            className="mt-3 text-sm text-purple-700 hover:text-purple-900 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BonusCodeHistory;
