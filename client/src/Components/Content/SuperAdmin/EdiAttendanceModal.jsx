import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import {
  AttendanceThunk,
  UpdateAttendanceThunk,
} from "../../../redux/thunk/AttendanceThunk";
import { toast } from "react-toastify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "0.2px solid #000",
  boxShadow: 24,
  p: 4,
};

function EdiAttendanceModal({ open, handleClose, selectedEmpData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    employee_name: selectedEmpData?.employee_name || "",
    performance: selectedEmpData?.performance_percentage || "",
    checkin_1: selectedEmpData?.checkin_1 || "",
    checkin_2: selectedEmpData?.checkin_2 || "",
    checkin_3: selectedEmpData?.checkin_3 || "",
    checkout_1: selectedEmpData?.checkout_1 || "",
    checkout_2: selectedEmpData?.checkout_2 || "",
    checkout_3: selectedEmpData?.checkout_3 || "",
  });

  useEffect(() => {
    setValues({
      employee_name: selectedEmpData?.employee_name || "",
      performance: selectedEmpData?.performance_percentage || "",
      checkin_1: selectedEmpData?.checkin_1 || "",
      checkin_2: selectedEmpData?.checkin_2 || "",
      checkin_3: selectedEmpData?.checkin_3 || "",
      checkout_1: selectedEmpData?.checkout_1 || "",
      checkout_2: selectedEmpData?.checkout_2 || "",
      checkout_3: selectedEmpData?.checkout_3 || "",
    });
  }, [selectedEmpData]);

  const handleUpdate = () => {
    if (
      values.performance !== "" ||
      values.employee_name !== "" ||
      selectedEmpData?.login_date !== ""
    ) {
      const payload = {
        user_id: selectedEmpData?.employee_id,
        login_date: selectedEmpData?.login_date,
        performance_percentage: values.performance,
        logs: [
          { checkin: values.checkin_1, checkout: values.checkout_1 },
          { checkin: values.checkin_2, checkout: values.checkout_2 },
          { checkin: values.checkin_3, checkout: values.checkout_3 },
        ],
      };
      dispatch(UpdateAttendanceThunk(payload)).then(() => {
        dispatch(AttendanceThunk(selectedEmpData?.login_date)).then(() => {
          handleClose();
        });
      });
    } else {
      toast.error("required Field Missing");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Employee Attendance
        </Typography>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextField
              label="Employee Name"
              name="employee_name"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.employee_name}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextField
              label="Performance"
              name="performance"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.performance}
              onChange={(e) =>
                setValues({ ...values, performance: e.target.value })
              }
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-In 1"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkin_1 ? dayjs(values.checkin_1, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkin_1: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkin_1",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-out 1"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkout_1 ? dayjs(values.checkout_1, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkout_1: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkout_1",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-In 2"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkin_2 ? dayjs(values.checkin_2, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkin_2: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkin2",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-out 2"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkout_2 ? dayjs(values.checkout_2, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkout_2: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkout_2",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-In 3"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkin_3 ? dayjs(values.checkin_3, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkin_3: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkin_3",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-out 3"
                size="small"
                className="my-2"
                fullWidth
                value={
                  values.checkout_3 ? dayjs(values.checkout_3, "hh:mm A") : null
                }
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  setValues({ ...values, checkout_3: time });
                }}
                slotProps={{
                  textField: {
                    name: "checkout_3",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              style={{
                backgroundColor: "orange",
                color: "#f6f6f6",
                padding: "4px 6px",
              }}
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
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default EdiAttendanceModal;
