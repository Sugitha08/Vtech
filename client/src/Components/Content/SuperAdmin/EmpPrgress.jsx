import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmpProgressThunk } from "../../../redux/thunk/EmpProgressThunk";
import { useNavigate } from "react-router-dom";
import EditProgressModal from "./EditProgressModal";

function EmpPrgress() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const filterEmpData = employeeData?.filter(
    (data) =>
      data?.employee_name
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.project
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.title
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.isbn?.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );
  const [editProOpen, setEditProOpen] = useState(false);
  const handleEditAttendance = () => {
    setEditProOpen(true);
  };
  const handleCloseEdit = () => {
    setEditProOpen(false);
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
            <TextField
              size="small"
              variant="outlined"
              label="Search by Employee Name..."
              value={searchTerm}
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableCell sx={{ width: 80 }}>Status</TableCell>
              <TableCell sx={{ width: 70 }}>In-Time</TableCell>
              <TableCell sx={{ width: 70 }}>Out-Time</TableCell>
              {/* <TableCell sx={{ width: 60 }} align="center">
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <div>Getting Data...</div>
            ) : filterEmpData?.length > 0 ? (
              [...filterEmpData]
                ?.sort((a, b) => a.employee_name.localeCompare(b.employee_name))
                ?.map((emp) =>
                  emp?.tasks?.length > 0 ? (
                    emp.tasks.map((task, index) => (
                      <TableRow
                        key={`${emp.employee_id}-${index}`}
                        sx={{
                          "& td": {
                            padding: "9px 8px",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          },
                        }}
                      >
                        {/* Show name only on first task row */}
                        {index === 0 ? (
                          <TableCell
                            rowSpan={emp.tasks.length}
                            sx={{
                              maxWidth: 120,
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {emp.employee_name}
                          </TableCell>
                        ) : null}
                        <TableCell>{task.project || ""}</TableCell>
                        <TableCell>{task.title || ""}</TableCell>
                        <TableCell>
                          <span
                            style={{ cursor: "pointer" }}
                            role="button"
                            onClick={() => handleSendNotification(task)}
                          >
                            {task.isbn}
                          </span>
                        </TableCell>
                        <TableCell>{task.start_date}</TableCell>
                        <TableCell>{task.due_date}</TableCell>
                        <TableCell>{task.end_date}</TableCell>
                        <TableCell align="center">{task.pages}</TableCell>
                        <TableCell align="center">{task.target}</TableCell>
                        <TableCell align="center">{task.completed}</TableCell>
                        <TableCell align="center">{task.pending}</TableCell>
                        <TableCell align="center">
                          {" "}
                          <Tooltip
                            title={
                              task?.incomplete_topics?.length > 0 &&
                              task?.incomplete_topics?.map((status) => (
                                <div>{status}</div>
                              ))
                            }
                          >
                            <span style={{ cursor: "pointer" }}>
                              {task.status}
                            </span>
                          </Tooltip>
                        </TableCell>
                        {index === 0 ? (
                          <>
                            <TableCell
                              rowSpan={emp.tasks.length}
                              align="center"
                            >
                              {emp.in_time}
                            </TableCell>
                            <TableCell
                              rowSpan={emp.tasks.length}
                              align="center"
                            >
                              {emp.out_time}
                            </TableCell>
                          </>
                        ) : null}
                      </TableRow>
                    ))
                  ) : (
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
                      <TableCell>{emp.employee_name}</TableCell>
                      {emp?.user_status === "suspend" || emp?.is_leave ? (
                        <>
                          <TableCell colSpan={13} align="center">
                            {emp?.is_leave ? "leave" : emp?.user_status}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell colSpan={11}></TableCell>
                          <TableCell align="center">{emp.in_time}</TableCell>
                          <TableCell align="center">{emp.out_time}</TableCell>
                        </>
                      )}
                    </TableRow>
                  )
                )
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="p-3">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <EditProgressModal open={editProOpen} handleClose={handleCloseEdit} />
    </div>
  );
}

export default EmpPrgress;
