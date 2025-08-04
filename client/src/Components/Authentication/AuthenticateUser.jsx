import React, { useState } from "react";
import Box from "@mui/material/Box";
import "./Login.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { InputOtp } from "primereact/inputotp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function AuthenticateUser({
  open,
  handleClose,
  token,
  setTokens,
  handleVerifyOtp,
  verifyLoad,
}) {
  return (
    <Modal
      open={open}
      //   onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create SuperAdmin/Admin Account
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Enter OTP send to the Email Address
        </Typography>
        <div className="d-flex justify-content-center p-3">
          <InputOtp value={token} onChange={(e) => setTokens(e.value)} />
        </div>
        <div className="d-flex justify-content-end p-3">
          <Button
            style={{
              backgroundColor: "orange",
              color: "#f6f6f6",
              padding: "4px 6px",
            }}
            className="me-2"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "green",
              color: "#f6f6f6",
              padding: "4px 6px",
            }}
            onClick={handleVerifyOtp}
            disabled={verifyLoad ? true : false}
          >
            {verifyLoad ? (
              <>
                <span className="spinner" />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default AuthenticateUser;
