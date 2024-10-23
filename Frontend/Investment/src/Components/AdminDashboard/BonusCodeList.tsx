import React, { useEffect, useState } from "react";
import {
  getAllBonusCodes,
  toggleBonusCodeStatus,
} from "../../Services/bonusService";
import "./bonuslist.css";

interface BonusCode {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  active: boolean;
  tokenCount: number; // Added to track the number of tokens
  tokenPrice: number; // Added to track the price of tokens
}

const BonusCodeList: React.FC<{ onSelectBonusCode: (id: string) => void }> = ({
  onSelectBonusCode,
}) => {
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 6; // Number of items to display per page

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    try {
      const response = await getAllBonusCodes();
      setBonusCodes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (codeId: string, active: boolean) => {
    try {
      await toggleBonusCodeStatus(codeId, !active); // This sends the current active status to the backend
      fetchBonusCodes(); // Refresh the list after toggling
    } catch (error) {
      console.error(error);
      alert("Action failed."); // Inform the admin if it fails
    }
  };



  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Calculate the starting and ending index for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="bonus-list">
      <h2>Bonus Code Management</h2>
      <ul>
        {bonusCodes.slice(startIndex, endIndex).map((code) => (
          <li key={code._id} onClick={() => onSelectBonusCode(code._id)}>
            <h3>Code: {code.code}</h3>
            <p>Discount: {code.discountPercentage}%</p>
            <p>Expires: {new Date(code.expirationDate).toLocaleDateString()}</p>
            <p>Tokens: {code.tokenCount}</p> {/* Display number of tokens */}
            <p>Price per Token: ${code.tokenPrice.toFixed(2)}</p>{" "}
            {/* Display token price */}
            <button onClick={() => handleToggle(code._id, code.active)}>
              {code.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={endIndex >= bonusCodes.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BonusCodeList;
