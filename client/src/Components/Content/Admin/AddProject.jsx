import { Autocomplete, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProjectThunk } from "../../../redux/thunk/ProjectThunk";
import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { ProjectType } from "../Options";

function AddProject() {
  const dispatch = useDispatch();
  const initialValues = {
    type: "",
    project_title: "",
    client_name: "",
    total_pages: null,
    book_isbn: null,
    project_date: null,
  };

  const validation = Yup.object().shape({
    client_name: Yup.string()
      .min(3, "Title must have at least 3 characters")
      .required("*This field is required"),
    type: Yup.string()
      .min(3, "Title must have at least 3 characters")
      .required("*This field is required"),
    project_title: Yup.string()
      .min(3, "Title must have at least 3 characters")
      .required("*This field is required"),
    book_isbn: Yup.number()
      .typeError("*Must be a number")
      .required("*This field is required"),
    total_pages: Yup.number()
      .typeError("*Must be a number")
      .required("*This field is required"),
    project_date: Yup.string().required("*This field is required"),
  });
  const handleAddProject = ({ values, resetForm }) => {
    dispatch(ProjectThunk(values))
      .unwrap()
      .then(() => resetForm());
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleAddProject({ values, resetForm });
    },
  });

  return (
    <div className="addproject">
      <div className="my-3">
        <h6
          style={{
            color: "rgb(34, 128, 184)",
            fontSize: "20px",
            fontWeight: "700",
          }}
          className="mb-0"
        >
          Project Registration
        </h6>
      </div>
      <div className="card p-3 ">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-lg-2">
              <TextField
                size="small"
                variant="outlined"
                label="Client Name"
                fullWidth
                name="client_name"
                value={formik.values?.client_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.client_name &&
                  Boolean(formik.errors.client_name)
                }
                helperText={
                  formik.touched.client_name &&
                  formik.errors.client_name &&
                  formik.errors.client_name
                }
              />
            </div>
            <div className="col-lg-2">
              <Autocomplete
                options={ProjectType}
                getOptionLabel={(option) => option?.label}
                value={
                  ProjectType?.find(
                    (emp) =>
                      emp.value === formik.values.type
                  ) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    `type`,
                    newValue?.value
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="type"
                    label="Project Type"
                    size="small"
                    fullWidth
                    error={
                      formik.touched.type &&
                      Boolean(formik.errors.type)
                    }
                    helperText={
                      formik.touched.type &&
                      formik.errors.type &&
                      formik.errors.type
                    }
                  />
                )}
              />
            </div>
            <div className="col-lg-2">
              <TextField
                label="Project Title"
                size="small"
                fullWidth
                name="project_title"
                value={formik.values?.project_title || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.project_title &&
                  Boolean(formik.errors.project_title)
                }
                helperText={
                  formik.touched.project_title &&
                  formik.errors.project_title &&
                  formik.errors.project_title
                }
              />
            </div>

            <div className="col-lg-2">
              <TextField
                size="small"
                variant="outlined"
                label="Book_Isbn"
                fullWidth
                name="book_isbn"
                value={formik.values?.book_isbn || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.book_isbn && Boolean(formik.errors.book_isbn)
                }
                helperText={
                  formik.touched.book_isbn &&
                  formik.errors.book_isbn &&
                  formik.errors.book_isbn
                }
              />
            </div>
            <div className="col-lg-2">
              <TextField
                size="small"
                variant="outlined"
                label="Total Pages"
                fullWidth
                name="total_pages"
                value={formik.values?.total_pages || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.total_pages &&
                  Boolean(formik.errors.total_pages)
                }
                helperText={
                  formik.touched.total_pages &&
                  formik.errors.total_pages &&
                  formik.errors.total_pages
                }
              />
            </div>
            <div className="col-lg-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start date"
                  size="small"
                  value={dayjs(formik.values?.project_date) || ""}
                  onChange={(newValue) => {
                    const date = dayjs(newValue).format("YYYY-MM-DD");
                    formik.setFieldValue("project_date", date);
                  }}
                  onBlur={formik.handleBlur}
                  slotProps={{
                    textField: {
                      name: `tasks[].project_date`,
                      size: "small",
                      fullWidth: true,
                      error:
                        !!formik.touched?.project_date &&
                        !!formik.errors?.project_date,
                      helperText:
                        formik.touched?.project_date &&
                        formik.errors?.project_date,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#2280b8",
                  color: "#fff",
                  fontWeight: "500",
                }}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
