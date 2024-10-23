import React, { useState } from "react";
import BonusCodeForm from "./BonusCodeForm";
import BonusCodeList from "./BonusCodeList";
import BonusCodeHistory from "./BonusHistory";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>("create");
  const [selectedBonusCode, setSelectedBonusCode] = useState<string | null>(
    null
  );
  const investorId = "investor-123";

  const renderContent = () => {
    switch (selectedMenu) {
      case "create":
        return (
          <div>
            <h2>Create Bonus Code</h2>
            <BonusCodeForm />
          </div>
        );
      case "manage":
        return (
          <div>
            <h2>Manage Bonus Codes</h2>
            <BonusCodeList onSelectBonusCode={setSelectedBonusCode} />
          </div>
        );
      case "history":
        return (
          selectedBonusCode && (
            <div>
              <h2>Bonus Code Usage History</h2>
              <BonusCodeHistory investorId={investorId} />
            </div>
          )
        );
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <ul className="menu-list">
          <li
            className={selectedMenu === "create" ? "active" : ""}
            onClick={() => setSelectedMenu("create")}
          >
            Create Bonus Code
          </li>
          <li
            className={selectedMenu === "manage" ? "active" : ""}
            onClick={() => setSelectedMenu("manage")}
          >
            Manage Bonus Codes
          </li>
          <li
            className={selectedMenu === "history" ? "active" : ""}
            onClick={() => setSelectedMenu("history")}
          >
            Bonus Code History
          </li>
        </ul>
      </div>

      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
