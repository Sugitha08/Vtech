import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";
import { useDispatch, useSelector } from "react-redux";
import { GetPerEmpPerformanceThunk } from "../../../redux/thunk/EmpPerformanceThunk";
import dayjs from "dayjs";

function EmpProfile() {
  const dispatch = useDispatch();
  const { Empperformance } = useSelector((state) => state?.Performance);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [filter_date, setFilter_date] = useState(currentDate);
  const [Performance, setPerformance] = useState(0);
  useEffect(() => {
    dispatch(GetPerEmpPerformanceThunk(filter_date));
  }, [filter_date]);
  useEffect(() => { 
    setPerformance(Empperformance?.performance_percentage);
  }, [Empperformance]);

  return (
    <div className="profile card p-3">
      <div className="d-flex justify-content-between align-items-center my-2">
        <div>
          <h6
            style={{
              color: "rgb(34, 128, 184)",
              fontSize: "20px",
              fontWeight: "700",
            }}
            className="mb-0"
          >
            Employee Performance
          </h6>
        </div>
        <div className="w-25">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Search date"
              size="small"
              value={dayjs(filter_date) || null}
              onChange={(newValue) => {
                const date = dayjs(newValue).format("YYYY-MM-DD");
                setFilter_date(date);
              }}
              // onBlur={formik.handleBlur}
              slotProps={{
                textField: {
                  name: "setFilter_date",
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 3 }}
        >
          <Gauge width={100} height={100} value={Performance} />
        </Stack>
      </div>
    </div>
  );
}

export default EmpProfile;
