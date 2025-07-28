import React, { useEffect } from "react";
import "./Header.css";
import { RxAvatar } from "react-icons/rx";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LogoutThunk } from "../../redux/thunk/LogoutThunk";
import { useNavigate } from "react-router-dom";

function Header({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const isoFormat = new Date()
      .toLocaleString("sv-SE", {
        timeZone: "Asia/Kolkata",
      })
      .replace(" ", "T"); // Converts "2025-07-28 10:40:12" to "2025-07-28T10:40:12"

    const payload = {
      checkOut: isoFormat,
    };

    console.log(payload);
    
    dispatch(LogoutThunk(payload))
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="Header shadow">
        <h4 style={{ color: "#2EA3F2", cursor: "pointer" }} className="mb-0">
          Vijra Technology
        </h4>
        {children}
        <div>
          <span
            role="button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleAvatarClick}
          >
            <RxAvatar size="25" />
          </span>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </>
  );
}

export default Header;
