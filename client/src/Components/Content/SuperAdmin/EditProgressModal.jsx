import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
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

function EditProgressModal({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Employee Progress
        </Typography>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Employee Name"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Project Type"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Book Title"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Book ISBN"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="start Date"
                size="small"
                className="my-2"
                fullWidth
                onChange={(newValue) => {
                  //   const time = newValue.format("hh:mm A");
                  //   formik.setFieldValue("checkOut", time);
                }}
                // onBlur={formik.handleBlur}
                slotProps={{
                  textField: {
                    name: "checkin2",
                    size: "small",
                    fullWidth: true,
                    // error: formik.touched.checkOut && formik.errors.checkOut,
                    // helperText:
                    //   formik.touched.checkOut && formik.errors.checkOut,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                size="small"
                className="my-2"
                fullWidth
                onChange={(newValue) => {
                  //   const time = newValue.format("hh:mm A");
                  //   formik.setFieldValue("checkOut", time);
                }}
                // onBlur={formik.handleBlur}
                slotProps={{
                  textField: {
                    name: "checkin2",
                    size: "small",
                    fullWidth: true,
                    // error: formik.touched.checkOut && formik.errors.checkOut,
                    // helperText:
                    //   formik.touched.checkOut && formik.errors.checkOut,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                size="small"
                className="my-2"
                fullWidth
                onChange={(newValue) => {
                  //   const time = newValue.format("hh:mm A");
                  //   formik.setFieldValue("checkOut", time);
                }}
                // onBlur={formik.handleBlur}
                slotProps={{
                  textField: {
                    name: "checkin2",
                    size: "small",
                    fullWidth: true,
                    // error: formik.touched.checkOut && formik.errors.checkOut,
                    // helperText:
                    //   formik.touched.checkOut && formik.errors.checkOut,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Total Pages"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <TextField
              label="Target Pages"
              //   name={`project[${index}].project_title`}
              className="my-2"
              variant="outlined"
              size="small"
              fullWidth
              //   value={formik.values.project[index].project_title || ""}
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              //   error={
              //     formik.touched.project?.[index]?.project_title &&
              //     Boolean(formik.errors.project?.[index]?.project_title)
              //   }
              //   helperText={
              //     formik.touched.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title &&
              //     formik.errors.project?.[index]?.project_title
              //   }
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-In"
                size="small"
                className="my-2"
                fullWidth
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  //   formik.setFieldValue("checkOut", time);
                }}
                slotProps={{
                  textField: {
                    name: "checkin",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Check-Out"
                size="small"
                className="my-2"
                fullWidth
                onChange={(newValue) => {
                  const time = newValue.format("hh:mm A");
                  //   formik.setFieldValue("checkOut", time);
                }}
                // onBlur={formik.handleBlur}
                slotProps={{
                  textField: {
                    name: "checkout",
                    size: "small",
                    fullWidth: true,
                    // error: formik.touched.checkOut && formik.errors.checkOut,
                    // helperText:
                    //   formik.touched.checkOut && formik.errors.checkOut,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              style={{
                backgroundColor: "green",
                color: "#f6f6f6",
                padding: "4px 6px",
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default EditProgressModal;
