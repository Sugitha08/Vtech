import { Autocomplete, IconButton, TextField, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { GetAllEmployeeThunk } from "../../../redux/thunk/EmployeeThunk";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { AssignTaskThunk } from "../../../redux/thunk/AssignTask";

function TaskAssign() {
  const { all_employee, loading } = useSelector((state) => state.Employee);
  const location = useLocation();
  const ErrorInFile = location?.state;
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    dispatch(GetAllEmployeeThunk());
  }, []);

  useEffect(() => {
    setEmployees(all_employee?.employees);
  }, [all_employee]);

  const initialValues = {
    tasks: [
      {
        employee_id: ErrorInFile?.employee_id ? ErrorInFile?.employee_id : null,
        book_isbn: ErrorInFile?.isbn ? ErrorInFile?.isbn : "",
        book_title: ErrorInFile?.title ? ErrorInFile?.title : "",
        target_pages: ErrorInFile?.target ? ErrorInFile?.target : "",
        start_date: ErrorInFile?.start_date
          ? dayjs(ErrorInFile?.start_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : "",
        due_date: "",
        task_note: "",
        source: ErrorInFile ? "error" : "assign",
      },
    ],
  };
  const validation = Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        book_title: Yup.string()
          .min(3, "Title must have at least 3 characters")
          .required("*This field is required"),
        book_isbn: Yup.number()
          .typeError("*Must be a number")
          .required("*This field is required"),
        employee_id: Yup.number().required("*This field is required"),
      })
    ),
  });
  const handleAssignTask = ({ values, resetForm }) => {
    const payload = {
      tasks: values?.tasks,
    };
    dispatch(AssignTaskThunk(payload))
      .unwrap()
      .then(() => resetForm());
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleAssignTask({ values, resetForm });
    },
  });

  const handleFieldAdd = () => {
    const newProject = {
      employee_id: null,
      book_isbn: "",
      book_title: "",
      target_pages: "",
      start_date: "",
      due_date: "",
      task_note: "",
      source: null,
    };

    formik.setFieldValue("tasks", [...formik.values.tasks, newProject]);
  };

  const handleDeleteRow = (index) => {
    const updatedProjects = [...formik.values.tasks];
    updatedProjects.splice(index, 1); // remove 1 item at that index
    formik.setFieldValue("tasks", updatedProjects);
  };
  return (
    <div className="task-assign">
      <div className="my-3">
        <h6
          style={{
            color: "rgb(34, 128, 184)",
            fontSize: "20px",
            fontWeight: "700",
          }}
          className="mb-0"
        >
          Allocate task For Employee
        </h6>
      </div>
      <div className="card p-3 ">
        <form onSubmit={formik.handleSubmit}>
          {formik?.values?.tasks?.length > 0 &&
            formik?.values?.tasks?.map((data, index) => (
              <div className="row row-gap-3">
                <div className="col-lg-2">
                  <Autocomplete
                    options={employees}
                    getOptionLabel={(option) => option?.name}
                    value={
                      employees?.find(
                        (emp) =>
                          emp.id === formik.values.tasks?.[index]?.employee_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        `tasks[${index}].employee_id`,
                        newValue?.id
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name={`tasks[${index}].employee_id`}
                        label="Employee Name"
                        size="small"
                        fullWidth
                        error={
                          formik.touched.tasks?.[index]?.employee_id &&
                          Boolean(formik.errors.tasks?.[index]?.employee_id)
                        }
                        helperText={
                          formik.touched.tasks?.[index]?.employee_id &&
                          formik.errors.tasks?.[index]?.employee_id &&
                          formik.errors.tasks?.[index]?.employee_id
                        }
                      />
                    )}
                  />
                </div>
                <div className="col-lg-2">
                  <TextField
                    size="small"
                    name={`tasks[${index}].book_title`}
                    variant="outlined"
                    label="Book Title"
                    fullWidth
                    value={formik.values.tasks[index].book_title || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tasks?.[index]?.book_title &&
                      Boolean(formik.errors.tasks?.[index]?.book_title)
                    }
                    helperText={
                      formik.touched.tasks?.[index]?.book_title &&
                      formik.errors.tasks?.[index]?.book_title &&
                      formik.errors.tasks?.[index]?.book_title
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <TextField
                    size="small"
                    variant="outlined"
                    label="Book ISBN"
                    name={`tasks[${index}].book_isbn`}
                    fullWidth
                    value={formik.values.tasks[index].book_isbn || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tasks?.[index]?.book_isbn &&
                      Boolean(formik.errors.tasks?.[index]?.book_isbn)
                    }
                    helperText={
                      formik.touched.tasks?.[index]?.book_isbn &&
                      formik.errors.tasks?.[index]?.book_isbn &&
                      formik.errors.tasks?.[index]?.book_isbn
                    }
                  />
                </div>

                <div className="col-lg-2">
                  <TextField
                    size="small"
                    variant="outlined"
                    label="Target Pages"
                    name={`tasks[${index}].target_pages`}
                    value={formik.values.tasks[index].target_pages || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                  />
                </div>
                <div className="col-lg-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start date"
                      size="small"
                      value={
                        dayjs(formik.values.tasks?.[index]?.start_date) || null
                      }
                      onChange={(newValue) => {
                        const date = dayjs(newValue).format("YYYY-MM-DD");
                        formik.setFieldValue(
                          `tasks[${index}].start_date`,
                          date
                        );
                      }}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        textField: {
                          name: `tasks[${index}].start_date`,
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="col-lg-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due date"
                      size="small"
                      value={
                        dayjs(formik.values.tasks?.[index]?.due_date) || null
                      }
                      onChange={(newValue) => {
                        const date = dayjs(newValue).format("YYYY-MM-DD");
                        formik.setFieldValue(`tasks[${index}].due_date`, date);
                      }}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        textField: {
                          name: `tasks[${index}].due_date`,
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="col-lg-3">
                  <TextField
                    size="small"
                    variant="outlined"
                    label="Task"
                    fullWidth
                    name={`tasks[${index}].task_note`}
                    value={formik.values.tasks[index].task_note || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.values.tasks.length > 1 && (
                  <div className="delete" style={{ marginTop: "-8px" }}>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <MdDelete color="gray" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </div>
            ))}
          <div>
            <button
              type="button"
              className="btn mt-3"
              style={{
                padding: "4px 8px",
                color: "#f6f6f6",
                backgroundColor: "#1c5b99",
                fontSize: "14px",
              }}
              onClick={handleFieldAdd}
            >
              Add task
            </button>
          </div>
          <div className=" mt-4 d-flex justify-content-start">
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
        </form>
      </div>
    </div>
  );
}

export default TaskAssign;
