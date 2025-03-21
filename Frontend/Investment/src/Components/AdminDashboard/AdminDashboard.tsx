import React, { useState } from "react";
import BonusCodeForm from "./BonusCodeForm";
import BonusCodeList from "./BonusCodeList";
import BonusCodeHistory from "./BonusHistory";
import {
  Home,
  PlusCircle,
  Settings,
  Clock,
  Bell,
  Mail,
  Search,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>("create");
  const [selectedBonusCode, setSelectedBonusCode] = useState<string | null>(
    null
  );
  const [notifications, setNotifications] = useState<number>(3);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const investorId = "investor-123";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to body
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "create":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Create Bonus Code
            </h2>
            <BonusCodeForm />
          </div>
        );
      case "manage":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Manage Bonus Codes
            </h2>
            <BonusCodeList onSelectBonusCode={setSelectedBonusCode} />
          </div>
        );
      case "history":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Bonus Code Usage History
            </h2>
            <BonusCodeHistory investorId={investorId} />
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-64">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Select an option from the menu
            </p>
          </div>
        );
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    {
      id: "create",
      label: "Create Bonus Code",
      icon: <PlusCircle size={20} />,
    },
    { id: "manage", label: "Manage Bonus Codes", icon: <Settings size={20} /> },
    { id: "history", label: "Bonus Code History", icon: <Clock size={20} /> },
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-indigo-800 dark:bg-gray-900 text-white`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">PromoAdmin</h1>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-indigo-700 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`${
                  selectedMenu === item.id
                    ? "bg-indigo-900 dark:bg-gray-800 border-l-4 border-white"
                    : "hover:bg-indigo-700 dark:hover:bg-gray-800"
                } transition-all duration-200 cursor-pointer`}
                onClick={() => setSelectedMenu(item.id)}
              >
                <div
                  className={`flex items-center py-3 ${
                    sidebarOpen ? "px-6" : "px-4 justify-center"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 w-full pb-6">
          <div
            className={`flex items-center ${
              sidebarOpen ? "px-6" : "px-4 justify-center"
            } py-3 hover:bg-indigo-700 dark:hover:bg-gray-800 cursor-pointer`}
          >
            <LogOut size={20} className="mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 w-64">
              <Search size={20} className="text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              <div className="relative">
                <Bell
                  size={20}
                  className="text-gray-600 dark:text-gray-300 cursor-pointer"
                />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {notifications}
                  </span>
                )}
              </div>

              <Mail
                size={20}
                className="text-gray-600 dark:text-gray-300 cursor-pointer"
              />

              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Bonus Code Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage promotional bonus codes for your users
            </p>
          </div>

          {/* Dashboard Stats */}
          {selectedMenu === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Bonus Codes
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      24
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <PlusCircle
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Redemptions
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      156
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600 dark:text-green-400"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expiring Soon
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      7
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <Clock
                      size={24}
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
