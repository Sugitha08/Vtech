import React from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Layout.css";

function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <div className="emp-layout">
      <Header>
        <div className="Nav-bar">
          <Link
            to="/admin/attendance"
            className={`${pathname === "/admin/attendance" ? "active" : ""}`}
          >
            Employee Attendance Tracker
          </Link>
          <Link
            to="/admin/progress"
            className={`${pathname === "/admin/progress" ? "active" : ""}`}
          >
            Employee Progress Tracker
          </Link>
          <Link
            to="/admin/taskassign"
            className={`${pathname === "/admin/taskassign" ? "active" : ""}`}
          >
            Assign Tasks
          </Link>
          <Link
            to="/admin/addproject"
            className={`${pathname === "/admin/addproject" ? "active" : ""}`}
          >
            New Project
          </Link>
        </div>
      </Header>
      <div className="emp-content">
        <h4 className="mt-1 mb-2">
          Admin : <span className="emp-name">Admin Name</span>
        </h4>
        <>
          <Outlet />
        </>
      </div>
    </div>
  );
}

export default AdminLayout;
