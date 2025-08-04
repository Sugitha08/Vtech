import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  EditEmployeeThunk,
  GetAllEmployeeThunk,
} from "../../../redux/thunk/EmployeeThunk";
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

function EditEmployeeModal({ open, handleClose, selectedEmpData }) {
  const dispatch = useDispatch();
  const Emp_role = [
    { label: "Employee", value: "employee" },
    { label: "Admin", value: "admin" },
    { label: "SuperAdmin", value: "superadmin" },
  ];
  const selectedRole = Emp_role.find(
    (item) => item.value === selectedEmpData?.role
  );
  const Status_type = [
    { label: "Suspend", value: "suspend" },
    { label: "InActive", value: "inactive" },
    { label: "Active", value: "active" },
  ];
  const [values, setValues] = useState({
    full_name: selectedEmpData?.full_name || "",
    role: selectedRole || null,
    username: selectedEmpData?.username || "",
    email: selectedEmpData?.email || "",
    status: selectedEmpData?.status || "",
  });

  useEffect(() => {
    setValues({
      full_name: selectedEmpData?.full_name || "",
      role: selectedRole || null,
      username: selectedEmpData?.username || "",
      email: selectedEmpData?.email || "",
      status: selectedEmpData?.status || "",
    });
  }, [selectedEmpData]);

  const handleUpdate = () => {
    if (
      values.full_name !== "" ||
      values.role !== "" ||
      values.username !== "" ||
      values.email !== "" ||
      values.status !== ""
    ) {
      const payload = {
        id: selectedEmpData?.id,
        full_name: values.full_name,
        role: values.role?.value,
        username: values.username,
        email: values.email,
        status: values.status,
      };
      dispatch(EditEmployeeThunk(payload)).then(() => {
        dispatch(GetAllEmployeeThunk()).then(() => {
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
          Edit Employee Data
        </Typography>
        <div className="row row-gap-2">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextField
              label="Full Name"
              name="full_name"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.full_name}
              onChange={(e) =>
                setValues({ ...values, full_name: e.target.value })
              }
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <Autocomplete
              options={Emp_role}
              getOptionLabel={(option) => option?.label}
              value={values.role}
              onChange={(event, newValue) => {
                setValues({ ...values, role: newValue?.value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  name="role"
                  size="small"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextField
              label="Username"
              name="username"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextField
              label="Email"
              name="email"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <Autocomplete
              options={Status_type}
              getOptionLabel={(option) => option?.label}
              value={
                Status_type?.find((emp) => emp.value === values.status) || null
              }
              onChange={(event, newValue) => {
                setValues({ ...values, status: newValue?.value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="status"
                  label="Status"
                  size="small"
                  fullWidth
                />
              )}
            />
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

export default EditEmployeeModal;
