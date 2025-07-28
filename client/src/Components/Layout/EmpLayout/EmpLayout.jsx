import React from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Layout.css";

function EmpLayout() {
  const { pathname } = useLocation();
  return (
    <div className="emp-layout">
      <Header>
        <div className="Nav-bar">
          <Link
            to="/employee/todayTask"
            className={`${pathname === "/employee/todayTask" ? "active" : ""}`}
          >
            Today Task
          </Link>
          <Link
            to="/employee/taskUpdate"
            className={`${pathname === "/employee/taskUpdate" ? "active" : ""}`}
          >
            Task Update
          </Link>
          <Link
            to="/employee/notification"
            className={`${
              pathname === "/employee/notification" ? "active" : ""
            }`}
          >
            Notification
          </Link>
        </div>
      </Header>
      <div className="emp-content container">
        <h4 className="mt-3 mb-4">
          Employee Name : <span className="emp-name">dfsdsdf</span>{" "}
        </h4>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmpLayout;
