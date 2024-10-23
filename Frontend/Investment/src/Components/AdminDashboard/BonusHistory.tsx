import React, { useEffect, useState } from "react";
import axios from "axios";
const token = "9b1f5e5a7d2e3d5e6b7a2c9d4a7b8e1c8f6d5e2c3f8e7a6c9b4f3a2c1d9e4f5";

const BonusCodeHistory = ({ investorId }) => {
  const [bonusHistory, setBonusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBonusHistory = async () => {
      try {

        const response = await axios.get(
          `http://localhost:8000/api/bonus/investors/${investorId}/bonus-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Added Authorization header
            },
          }
        );
        console.log(response.data); // Log the response data
        setBonusHistory(response.data);
      } catch (err) {
        setError("Failed to fetch bonus code history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBonusHistory();
  }, [investorId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Bonus Code History</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount Percentage</th>
            <th>Token Price</th>
            <th>Expiration Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bonusHistory.map((code) => (
            <tr key={code._id}>
              <td>{code.code}</td>
              <td>{code.discountPercentage}%</td>
              <td>${code.tokenPrice}</td>
              <td>{new Date(code.expirationDate).toLocaleDateString()}</td>
              <td>{code.active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BonusCodeHistory;
