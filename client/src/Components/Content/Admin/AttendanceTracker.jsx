import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceThunk } from "../../../redux/thunk/AttendanceThunk";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AddEmpPerformanceThunk } from "../../../redux/thunk/EmpPerformanceThunk";

function AttendanceTracker() {
  const dispatch = useDispatch();
  const { emp_attendance, loading } = useSelector(
    (state) => state.EmpAttendance
  );
  const [employeeData, setEmployeeData] = useState([]);
  const [performance, setPerformance] = useState({});

  const handlePerformanceChange = (empId, value) => {
    setPerformance((prev) => ({
      ...prev,
      [empId]: value,
    }));
  };
  useEffect(() => {
    setEmployeeData(emp_attendance);
  }, [emp_attendance]);

  const currentDate = dayjs().format("YYYY-MM-DD");
  const [filterDate, setFilterDate] = useState(currentDate);
  useEffect(() => {
    dispatch(AttendanceThunk(filterDate));
  }, [filterDate]);

  const handlePerformanceSubmit = async () => {
    const emp_performance = Object.keys(performance).map((empId) => ({
      employee_id: parseInt(empId),
      date: filterDate,
      performance_percentage: parseFloat(performance[empId]),
    }));

    dispatch(AddEmpPerformanceThunk({ emp_performance: emp_performance }));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filterEmpData = employeeData?.filter((data) =>
    data?.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="attendance-Table">
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
            Employee Attendance Tracker
          </h6>
        </div>
        <div className="row w-50 justify-content-end">
          <div className="col-lg-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seach date"
                size="small"
                value={dayjs(filterDate) || null}
                onChange={(newValue) => {
                  const date = dayjs(newValue).format("YYYY-MM-DD");
                  setFilterDate(date);
                }}
                // onBlur={formik.handleBlur}
                slotProps={{
                  textField: {
                    name: "filterDate",
                    // error:
                    //   !!formik.touched.project?.[index]?.due_date &&
                    //   !!formik.errors.project?.[index]?.due_date,
                    // helperText:
                    //   formik.touched.project?.[index]?.due_date &&
                    //   formik.errors.project?.[index]?.due_date,
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="search-field col-lg-6">
            <TextField
              size="small"
              variant="outlined"
              label="Search by Employee Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table
          sx={{
            width: "100%",
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              border: "0.2px solid #eeeeee",
            },
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: "bold", padding: "7px" } }}>
              <TableCell sx={{ width: 120 }}>Employee Name</TableCell>
              <TableCell sx={{ width: 80 }}>Performance</TableCell>
              <TableCell sx={{ width: 80 }}>Check-in 1</TableCell>
              <TableCell sx={{ width: 80 }}>Check-out 1</TableCell>
              <TableCell sx={{ width: 80 }}>Check-in 2</TableCell>
              <TableCell sx={{ width: 80 }}>Check-out 2</TableCell>
              <TableCell sx={{ width: 80 }}>Check-in 3</TableCell>
              <TableCell sx={{ width: 80 }}>Check-out 3</TableCell>
              <TableCell sx={{ width: 80 }} align="center">
                Working Hrs
              </TableCell>
              <TableCell sx={{ width: 82 }} align="center">
                Shortage Hrs
              </TableCell>
              <TableCell sx={{ width: 80 }} align="center">
                Late arrival
              </TableCell>
              <TableCell sx={{ width: 80 }} align="center">
                Permission
              </TableCell>
              <TableCell sx={{ width: 60 }} align="center">
                Leave
              </TableCell>
              <TableCell sx={{ width: 60 }} align="center">
                all Leave
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <div>Getting Data...</div>
            ) : filterEmpData?.length > 0 ? (
              [...filterEmpData]?.sort((a, b) => a.employee_name.localeCompare(b.employee_name))?.map((emp) => (
                <TableRow
                  key={emp?.employee_id}
                  sx={{ "& td": { padding: "7px" } }}
                >
                  <TableCell
                    sx={{
                      maxWidth: 120,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    {emp?.employee_name}
                  </TableCell>
                  {emp?.user_status !== "suspend" ? (
                    <>
                      <TableCell>
                        {emp.performance_percentage ? (
                          emp.performance_percentage
                        ) : (
                          <TextField
                            size="small"
                            variant="outlined"
                            value={
                              emp?.is_leave
                                ? 0
                                : performance[emp.employee_id] ?? ""
                            }
                            onChange={(e) =>
                              handlePerformanceChange(
                                emp.employee_id,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                      {emp?.is_leave ? (
                        <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                          Leave
                        </TableCell>
                      ) : (
                        <>
                          <TableCell align="center">{emp?.checkin_1}</TableCell>
                          <TableCell align="center">
                            {emp?.checkout_1}
                          </TableCell>
                          <TableCell align="center">{emp?.checkin_2}</TableCell>
                          <TableCell align="center">
                            {emp?.checkout_2}
                          </TableCell>
                          <TableCell align="center">{emp?.checkin_3}</TableCell>
                          <TableCell align="center">
                            {emp?.checkout_3}
                          </TableCell>
                          <TableCell align="center">
                            {emp?.working_hours}
                          </TableCell>
                          <TableCell align="center">
                            {emp?.shortage_hours}
                          </TableCell>
                        </>
                      )}
                      <TableCell align="center">{emp?.late_arrival}</TableCell>
                      <TableCell align="center">{emp?.permission}</TableCell>
                      <TableCell align="center">{emp?.leave}</TableCell>
                      <TableCell align="center">
                        {emp?.overall_leave_count}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell colSpan={13} align="center">
                        {emp?.user_status}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="p-3">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="my-3 d-flex justify-content-end">
        <button
          className="btn"
          style={{
            backgroundColor: "#2280b8",
            color: "#fff",
            fontWeight: "500",
          }}
          onClick={handlePerformanceSubmit}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default AttendanceTracker;
