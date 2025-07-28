import React from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Layout.css";
function SuperAdminLayout() {
  const { pathname } = useLocation();
  return (
    <div className="superAdmin-layout">
      <Header>
        <div className="Nav-bar">
          <Link
            to="/superadmin/Emp-attendance"
            className={`${
              pathname === "/superadmin/Emp-attendance" ? "active" : ""
            }`}
          >
            Employee Attendance
          </Link>
          <Link
            to="/superadmin/Emp-progress"
            className={`${
              pathname === "/superadmin/Emp-progress" ? "active" : ""
            }`}
          >
            Employee Progress
          </Link>
          <Link
            to="/superadmin/project"
            className={`${pathname === "/superadmin/project" ? "active" : ""}`}
          >
            Project
          </Link>
        </div>
      </Header>
      <div className="emp-content">
        <h4 className="mt-1 mb-2">
          Super Admin : <span className="emp-name">Super Admin Name</span>
        </h4>
        <>
          <Outlet />
        </>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
