import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  TextField,
  Tooltip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmpProgressThunk } from "../../../redux/thunk/EmpProgressThunk";
import { useNavigate } from "react-router-dom";

function ProgressTracker() {
  const { emp_Progress, loading } = useSelector((state) => state.EmpProgress);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState([]);
  useEffect(() => {
    setEmployeeData(emp_Progress);
  }, [emp_Progress]);

  const currentDate = dayjs().format("YYYY-MM-DD");
  const [filterDate, setFilterDate] = useState(currentDate);

  useEffect(() => {
    dispatch(EmpProgressThunk(filterDate));
  }, [filterDate]);

  const [searchinputValue, setSearchInputValue] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);

  const handleSearchInputChange = (event, value) => {
    setSearchInputValue(value);

    // Show options only after typing 2 or more characters
    if (value.length >= 2) {
      const filtered = employeeData.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setSearchOptions(filtered);
    } else {
      setSearchOptions([]);
    }
  };

  const handleSendNotification = (emp) => {
    navigate("/admin/taskassign", { state: { ...emp, progress: "error" } });
  };
  return (
    <div className="attendance-Table">
      <div className="d-flex justify-content-between align-items-center my-2">
        <h6
          style={{
            color: "rgb(34, 128, 184)",
            fontSize: "20px",
            fontWeight: "700",
          }}
          className="mb-0"
        >
          Project Progress Report :
        </h6>
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
            <Autocomplete
              options={searchOptions}
              inputValue={searchinputValue}
              onInputChange={handleSearchInputChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by employee ,title , ISBN ..."
                  size="small"
                  fullWidth
                />
              )}
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
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  padding: "10px 7px",
                  textAlign: "center",
                },
              }}
            >
              <TableCell sx={{ width: 100 }}>Employee</TableCell>
              <TableCell sx={{ width: 80 }}>Project</TableCell>
              <TableCell sx={{ width: 150 }}>Title</TableCell>
              <TableCell sx={{ width: 150 }}>ISBN No</TableCell>
              <TableCell sx={{ width: 80 }}>Start Date</TableCell>
              <TableCell sx={{ width: 80 }}>Due Date</TableCell>
              <TableCell sx={{ width: 80 }}>End Date</TableCell>
              <TableCell sx={{ width: 80 }}>Pages</TableCell>
              <TableCell sx={{ width: 80 }}>Target</TableCell>
              <TableCell sx={{ width: 80 }}>Completed</TableCell>
              <TableCell sx={{ width: 80 }}>Pending </TableCell>
              <TableCell sx={{ width: 150 }}>Status</TableCell>
              <TableCell sx={{ width: 70 }}>In-Time</TableCell>
              <TableCell sx={{ width: 70 }}>Out-Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeData?.length > 0 ? (
              employeeData.map((emp) => (
                <TableRow
                  key={emp.employee_id}
                  sx={{
                    "& td": {
                      padding: "9px 8px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      maxWidth: 120,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    {emp.employee_name}
                  </TableCell>
                  <TableCell>{emp.project}</TableCell>
                  <TableCell>{emp.title}</TableCell>
                  <TableCell>
                    <Tooltip title="click to send error">
                      <span
                        style={{ cursor: "pointer" }}
                        role="button"
                        onClick={() => handleSendNotification(emp)}
                      >
                        {emp.isbn}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{emp.start_date}</TableCell>
                  <TableCell>{emp.due_date}</TableCell>
                  <TableCell>{emp.end_date}</TableCell>
                  <TableCell align="center">{emp.pages}</TableCell>
                  <TableCell align="center">{emp.target}</TableCell>
                  <TableCell align="center">{emp.completed}</TableCell>
                  <TableCell align="center">{emp.pending}</TableCell>
                  <TableCell align="center">{emp.status}</TableCell>
                  <TableCell align="center">{emp.in_time}</TableCell>
                  <TableCell align="center">{emp.out_time}</TableCell>
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
    </div>
  );
}

export default ProgressTracker;
