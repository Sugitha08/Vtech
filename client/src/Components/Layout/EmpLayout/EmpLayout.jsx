import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../Layout.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Base_url } from "../../../Environment/Environment";

function EmpLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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

  const handleProfileClick = () => {
    navigate("/employee/profile");
  };
  return (
    <div className="emp-layout">
      <Header handleProfileClick={handleProfileClick}>
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
          <Link
            to="/employee/permission"
            className={`${pathname === "/employee/permission" ? "active" : ""}`}
          >
            Permission
          </Link>
        </div>
      </Header>
      <div className="emp-content container">
        <h4 className="mt-3 mb-4">
          Employee Name : <span className="emp-name">{userName}</span>{" "}
        </h4>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmpLayout;
