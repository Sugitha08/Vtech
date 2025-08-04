import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import dayjs from "dayjs";
import { AddPermissionThunk } from "../../../redux/thunk/EmployeeThunk";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";

function EmpPermission() {
  const dispatch = useDispatch();
  const [attendanceType, setAttendanceType] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    const current = dayjs().format("YYYY-MM-DD");
    const payload = {
      permission_type: attendanceType,
      date: current,
    };
    dispatch(AddPermissionThunk(payload))
      .unwrap()
      .then(() => {
        setAttendanceType("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div className="emp-task card shadow" style={{ padding: "20px" }}>
      <h5 style={{ color: "#2EA3F2" }}>Permission</h5>
      <div>
        <FormControl>
          <FormLabel>Attendance Type</FormLabel>
          <RadioGroup
            row
            name="attendance"
            value={attendanceType}
            onChange={(e) => setAttendanceType(e.target.value)}
          >
            <FormControlLabel value="leave" control={<Radio />} label="Leave" />
            <FormControlLabel
              value="permission"
              control={<Radio />}
              label="Permission"
            />
          </RadioGroup>
          {attendanceType === "permission " && (
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    label="Check-In 1"
                    size="small"
                    className="my-2"
                    fullWidth
                    value={
                      values.checkin_1
                        ? dayjs(values.checkin_1, "hh:mm A")
                        : null
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
                      values.checkout_1
                        ? dayjs(values.checkout_1, "hh:mm A")
                        : null
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
            </div>
          )}
        </FormControl>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          disabled={loading ? true : false}
          onClick={handleSubmit}
        >
          {loading ? "loading..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}

export default EmpPermission;
