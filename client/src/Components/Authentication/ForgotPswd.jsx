import React, { useState } from "react";
import "./Login.css";
import { Button, TextField, Typography } from "@mui/material";
import { InputOtp } from "primereact/inputotp";
import { useDispatch } from "react-redux";
import {
  ResetPswdThunk,
  sentOtpThunk,
  VerifyOtpThunk,
} from "../../redux/thunk/LoginThunk";
import { Link, useNavigate } from "react-router-dom";

function ForgotPswd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [resetpswdshow, setResetPswdShow] = useState(false);
  const [token, setTokens] = useState();
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const handleSendOtp = () => {
    if (email) {
      const payload = {
        email: email,
      };
      dispatch(sentOtpThunk(payload))
        .unwrap()
        .then(() => setShowOtpField(true));
    } else {
      alert("Enter email");
    }
  };
  const handleVerifyOtp = () => {
    if (token) {
      const payload = {
        email: email,
        otp: token,
      };
      dispatch(VerifyOtpThunk(payload))
        .unwrap()
        .then(() => {
          setShowOtpField(false);
          setResetPswdShow(true);
        });
    }
  };

  const handleResetPswd = () => {
    const payload = {
      email: email,
      password: password,
    };
    dispatch(ResetPswdThunk(payload))
      .unwrap()
      .then(() => {
        setResetPswdShow(false);
        navigate("/");
      });
  };
  
  return (
    <div className="forgotpswd d-flex justify-content-center mt-5">
      <div className="card p-3 mt-5" style={{ width: "40%" }}>
        {!resetpswdshow ? (
          <>
            <h6 className="text-center">Send Otp</h6>
            <div>Enter Your Email address</div>
            <TextField
              label="Enter Email address"
              size="small"
              className="my-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!showOtpField && (
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  style={{
                    backgroundColor: "green",
                    color: "#f6f6f6",
                    padding: "4px 6px",
                  }}
                  onClick={handleSendOtp}
                >
                  Send Otp
                </Button>
              </div>
            )}
            {showOtpField && (
              <>
                <div className="my-3">
                  <Typography>OTP is Send To the Admin Email Address</Typography>
                  <InputOtp
                    value={token}
                    onChange={(e) => setTokens(e.value)}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "green",
                      color: "#f6f6f6",
                      padding: "4px 6px",
                    }}
                    onClick={handleVerifyOtp}
                  >
                    Verify Otp
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h6 className="text-center">Reset Password</h6>
            <TextField
              label="Enter New Password"
              size="small"
              className="my-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Re-Enter New Password"
              size="small"
              className="my-3"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                style={{
                  backgroundColor: "green",
                  color: "#f6f6f6",
                  padding: "4px 6px",
                }}
                onClick={handleResetPswd}
              >
                Reset Password
              </Button>
            </div>
          </>
        )}
        <div className="" style={{ fontSize: "12px" }}>Back To Login  <Link to="/">Login</Link></div>
      </div>
    </div>
  );
}

export default ForgotPswd;
