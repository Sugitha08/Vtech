import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  DelEmployeeThunk,
  GetAllEmployeeThunk,
} from "../../../redux/thunk/EmployeeThunk";
import { MdEditCalendar } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditEmployeeModal from "./EditEmployeeModal";

function Employees() {
  const { all_employee, loading } = useSelector((state) => state.Employee);
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState([]);
  const [selectedEmpData, setSelectedEmpData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(GetAllEmployeeThunk());
  }, []);

  useEffect(() => {
    setEmployee(all_employee?.employees);
  }, [all_employee]);

  const [searchTerm, setSearchTerm] = useState("");

  const filterEmpData = employee?.filter((data) =>
    data?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCloseEdit = () => {
    setShowEditModal(false);
  };
  const handleEditEmployee = (emp) => {
    setShowEditModal(true);
    setSelectedEmpData(emp);
  };
  const handleDelEmployee = (empId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;
    dispatch(DelEmployeeThunk(empId)).then(() => {
      dispatch(GetAllEmployeeThunk());
    });
  };

  return (
    <div className="employee">
      <div className="d-flex justify-content-between align-items-center my-2">
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
        <div className="search-field col-lg-6 w-25">
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
      <div className="mt-3">
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
              <TableRow sx={{ "& th": { fontWeight: "bold", padding: "8px" } }}>
                <TableCell>Employee Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <div>Getting Data...</div>
              ) : filterEmpData?.length > 0 ? (
                [...filterEmpData]
                  ?.sort((a, b) =>
                    a.full_name.localeCompare(b.full_name)
                  )
                  ?.map((emp) => (
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
                        {emp?.full_name}
                      </TableCell>
                      <TableCell>{emp?.role}</TableCell>
                      <TableCell>{emp?.username}</TableCell>
                      <TableCell>{emp?.email}</TableCell>
                      <TableCell>{emp?.status}</TableCell>
                      <TableCell>
                        <Tooltip title="edit">
                          <IconButton onClick={() => handleEditEmployee(emp)}>
                            <MdEditCalendar size="14" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="delete">
                          <IconButton
                            onClick={() => handleDelEmployee(emp?.id)}
                          >
                            <MdDelete size="14" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-3">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <EditEmployeeModal
        open={showEditModal}
        handleClose={handleCloseEdit}
        selectedEmpData={selectedEmpData}
      />
    </div>
  );
}

export default Employees;
