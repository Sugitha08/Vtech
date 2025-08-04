import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Layout.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Base_url } from "../../../Environment/Environment";
function SuperAdminLayout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    axios
      .get(Base_url + "auth/get_user_name", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUserName(res?.data?.username));
  }, []);
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
          <Link
            to="/superadmin/performance"
            className={`${
              pathname === "/superadmin/performance" ? "active" : ""
            }`}
          >
            Employee Performance
          </Link>
                    <Link
            to="/superadmin/employees"
            className={`${
              pathname === "/superadmin/employees" ? "active" : ""
            }`}
          >
            Employees
          </Link>
        </div>
      </Header>
      <div className="emp-content">
        <h4 className="mt-1 mb-2">
          Super Admin : <span className="emp-name">{userName}</span>
        </h4>
        <>
          <Outlet />
        </>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
