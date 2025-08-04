import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Layout.css";
import { useDispatch } from "react-redux";
import { Base_url } from "../../../Environment/Environment";
import axios from "axios";

function AdminLayout() {
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
          Admin : <span className="emp-name">{userName}</span>
        </h4>
        <>
          <Outlet />
        </>
      </div>
    </div>
  );
}

export default AdminLayout;
