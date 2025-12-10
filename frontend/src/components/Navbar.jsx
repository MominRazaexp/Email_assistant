import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const baseClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "text-gray-700 hover:bg-gray-100";

  const getClassName = (isActive) => {
    return baseClasses + " " + (isActive ? activeClasses : inactiveClasses);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <span className="font-semibold text-gray-900">
              Email Assistant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => getClassName(isActive)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => getClassName(isActive)}
            >
              History
            </NavLink>
            <NavLink
              to="/monitoring"
              className={({ isActive }) => getClassName(isActive)}
            >
              Monitoring
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;