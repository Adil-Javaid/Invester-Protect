import React, { useEffect, useState } from "react";
import {
  getAllBonusCodes,
  toggleBonusCodeStatus,
} from "../../Services/bonusService";
import {
  Calendar,
  CreditCard,
  Percent,
  Power,
  Search,
  Tag,
  Clock,
} from "lucide-react";

interface BonusCode {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  active: boolean;
  tokenCount: number;
  tokenPrice: number;
}

const BonusCodeList: React.FC<{ onSelectBonusCode: (id: string) => void }> = ({
  onSelectBonusCode,
}) => {
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof BonusCode>("expirationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBonusCodes();
      setBonusCodes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (
    e: React.MouseEvent,
    codeId: string,
    active: boolean
  ) => {
    e.stopPropagation();
    try {
      await toggleBonusCodeStatus(codeId, !active);
      fetchBonusCodes();
    } catch (error) {
      console.error(error);
      alert("Action failed.");
    }
  };

  const handleSort = (column: keyof BonusCode) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const calculateTimeRemaining = (expirationDate: string): string => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffInMs = expiry.getTime() - now.getTime();

    if (diffInMs < 0) return "Expired";

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays > 0) return `${diffInDays} days`;

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours > 0) return `${diffInHours} hours`;

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minutes`;
  };

  const filteredCodes = bonusCodes
    .filter((code) =>
      code.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "expirationDate") {
        comparison =
          new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
      } else if (
        sortBy === "discountPercentage" ||
        sortBy === "tokenCount" ||
        sortBy === "tokenPrice"
      ) {
        comparison = a[sortBy] - b[sortBy];
      } else {
        comparison = String(a[sortBy]).localeCompare(String(b[sortBy]));
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCodes = filteredCodes.slice(startIndex, endIndex);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6 w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-800">
          Bonus Code Management
        </h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-md">
        <div className="bg-indigo-100 grid grid-cols-6 p-4 font-medium text-gray-700">
          <div
            className="col-span-1 flex items-center cursor-pointer"
            onClick={() => handleSort("code")}
          >
            <Tag size={16} className="mr-2 text-indigo-600" />
            <span>Code</span>
          </div>
          <div
            className="col-span-1 flex items-center cursor-pointer"
            onClick={() => handleSort("discountPercentage")}
          >
            <Percent size={16} className="mr-2 text-indigo-600" />
            <span>Discount</span>
          </div>
          <div
            className="col-span-1 flex items-center cursor-pointer"
            onClick={() => handleSort("expirationDate")}
          >
            <Calendar size={16} className="mr-2 text-indigo-600" />
            <span>Expires</span>
          </div>
          <div
            className="col-span-1 flex items-center cursor-pointer"
            onClick={() => handleSort("tokenCount")}
          >
            <CreditCard size={16} className="mr-2 text-indigo-600" />
            <span>Tokens</span>
          </div>
          <div
            className="col-span-1 flex items-center cursor-pointer"
            onClick={() => handleSort("tokenPrice")}
          >
            <CreditCard size={16} className="mr-2 text-indigo-600" />
            <span>Price/Token</span>
          </div>
          <div className="col-span-1 text-center">
            <span>Status</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : currentCodes.length > 0 ? (
          <div>
            {currentCodes.map((code) => {
              const isExpired = new Date(code.expirationDate) < new Date();
              const isExpiringSoon =
                !isExpired &&
                new Date(code.expirationDate).getTime() - new Date().getTime() <
                  3 * 24 * 60 * 60 * 1000;

              return (
                <div
                  key={code._id}
                  onClick={() => onSelectBonusCode(code._id)}
                  className={`grid grid-cols-6 p-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer ${
                    !code.active
                      ? "bg-gray-50"
                      : isExpired
                      ? "bg-red-50"
                      : isExpiringSoon
                      ? "bg-yellow-50"
                      : ""
                  }`}
                >
                  <div className="col-span-1 font-medium text-indigo-700">
                    {code.code}
                  </div>
                  <div className="col-span-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {code.discountPercentage}%
                    </span>
                  </div>
                  <div className="col-span-1">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        {new Date(code.expirationDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs flex items-center mt-1 ${
                          isExpired
                            ? "text-red-600"
                            : isExpiringSoon
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        <Clock size={12} className="mr-1" />
                        {calculateTimeRemaining(code.expirationDate)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 text-gray-700">
                    {code.tokenCount.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-gray-700">
                    ${code.tokenPrice.toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={(e) => handleToggle(e, code._id, code.active)}
                      className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                        code.active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      <Power size={14} className="mr-1" />
                      {code.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No bonus codes found. Try a different search term.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCodes.length)} of{" "}
          {filteredCodes.length} codes
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="px-3 py-1 rounded-md bg-indigo-600 text-white">
            {currentPage + 1} of {totalPages || 1}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={endIndex >= filteredCodes.length}
            className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={endIndex >= filteredCodes.length || totalPages <= 1}
            className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default BonusCodeList;
