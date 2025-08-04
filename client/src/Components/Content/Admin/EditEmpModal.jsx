import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { AdminEditEmployeeThunk } from "../../../redux/thunk/EmployeeThunk";
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

function EditEmpModal({ open, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    username: "",
    email: "",
    status: "",
  });

  const Status_type = [
    { label: "Suspend", value: "suspend" },
    { label: "InActive", value: "inactive" },
    { label: "Active", value: "active" },
  ];


  const handleUpdate = () => {
    setLoading(true);
    if (values.username !== "" || values.email !== "" || values.status !== "") {
      const payload = {
        username: values.username,
        email: values.email,
        status: values.status,
      };
      dispatch(AdminEditEmployeeThunk(payload))
        .then(() => {
          setValues({
            username: "",
            email: "",
            status: "",
          });
          setLoading(true);
          handleClose();
        })
        .catch((err) => {
          setLoading(false);
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
          <div className="col-12">
            <TextField
              label="Enter Employee Username"
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
          <div className="col-12">
            <TextField
              label="Enter Employee Email"
              name="username"
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="col-lg-12">
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
              disabled={loading ? true : false}
            >
              {loading ? "Loading" : "Update"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default EditEmpModal;
