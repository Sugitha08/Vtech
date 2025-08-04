import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDelete } from "react-icons/md";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { AddmrngTaskThunk } from "../../../redux/thunk/Addmrngtask";
import dayjs from "dayjs";

function EmpTask() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.MorningTask);
  const initialValues = {
    project: [
      {
        project_type: "",
        project_title: "",
        book_isbn: null,
        total_pages: null,
        target_pages: null,
        start_date: null,
        due_date: null,
        project_description: null,
      },
    ],
  };
  const projectType = [
    {
      label: "EPub",
      value: "epub",
    },
    {
      label: "Web Pdf",
      value: "webpdf",
    },
    {
      label: "XML",
      value: "xml",
    },
    {
      label: "QC",
      value: "qc",
    },
  ];

  const validation = Yup.object().shape({
    project: Yup.array().of(
      Yup.object().shape({
        project_type: Yup.string()
          .min(3, "Title must have at least 3 characters")
          .required("*This field is required"),
        project_title: Yup.string()
          .min(3, "Title must have at least 3 characters")
          .required("*This field is required"),
        book_isbn: Yup.string().required("*This field is required"),
        total_pages: Yup.number()
          .typeError("*Must be a number")
          .required("*This field is required"),
        target_pages: Yup.number()
          .typeError("*Must be a number")
          .required("*This field is required"),
        start_date: Yup.string().required("*This field is required"),
        due_date: Yup.string().required("*This field is required"),
      })
    ),
  });

  const handleAddTask = ({ values, resetForm }) => {
    const payload = {
      date: new Date().toISOString(),
      tasks: values?.project,
    };
    dispatch(AddmrngTaskThunk(payload))
      .unwrap()
      .then(() => resetForm());
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleAddTask({ values, resetForm });
    },
  });

  const handleFieldAdd = () => {
    const newProject = {
      project_type: "",
      project_title: "",
      book_isbn: null,
      total_pages: null,
      target_pages: null,
      start_date: null,
      due_date: null,
    };

    formik.setFieldValue("project", [...formik.values.project, newProject]);
  };
  const handleDeleteRow = (index) => {
    const updatedProjects = [...formik.values.project];
    updatedProjects.splice(index, 1); // remove 1 item at that index
    formik.setFieldValue("project", updatedProjects);
  };

  return (
    <div className="emp-task card shadow">
      <h5 style={{ color: "#2EA3F2" }}>Today's Work Plan</h5>
      <form onSubmit={formik.handleSubmit}>
        {formik?.values?.project?.length > 0 &&
          formik?.values?.project?.map((data, index) => (
            <div className="task-form row row-gap-2">
              <div className="col-lg-2 col-md-6 col-sm-12 ">
                <Autocomplete
                  options={projectType}
                  getOptionLabel={(option) => option?.label || ""}
                  value={
                    projectType.find(
                      (type) =>
                        type.value ===
                        formik.values.project?.[index]?.project_type
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      `project[${index}].project_type`,
                      newValue?.value || ""
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name={`project[${index}].project_type`}
                      label="Project Type"
                      size="small"
                      className="my-2"
                      fullWidth
                      error={
                        formik.touched.project?.[index]?.project_type &&
                        Boolean(formik.errors.project?.[index]?.project_type)
                      }
                      helperText={
                        formik.touched.project?.[index]?.project_type &&
                        formik.errors.project?.[index]?.project_type
                      }
                    />
                  )}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <TextField
                  label="Enter Title"
                  name={`project[${index}].project_title`}
                  className="my-2"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formik.values.project[index].project_title || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.project?.[index]?.project_title &&
                    Boolean(formik.errors.project?.[index]?.project_title)
                  }
                  helperText={
                    formik.touched.project?.[index]?.project_title &&
                    formik.errors.project?.[index]?.project_title &&
                    formik.errors.project?.[index]?.project_title
                  }
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-12">
                <TextField
                  label="Enter book ISBN"
                  name={`project[${index}].book_isbn`}
                  className="my-2"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formik.values.project[index].book_isbn || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.project?.[index]?.book_isbn &&
                    Boolean(formik.errors.project?.[index]?.book_isbn)
                  }
                  helperText={
                    formik.touched.project?.[index]?.book_isbn &&
                    formik.errors.project?.[index]?.book_isbn &&
                    formik.errors.project?.[index]?.book_isbn
                  }
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6">
                <TextField
                  label="Total pages"
                  name={`project[${index}].total_pages`}
                  className="my-2"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formik.values.project?.[index]?.total_pages || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.project?.[index]?.total_pages &&
                    Boolean(formik.errors.project?.[index]?.total_pages)
                  }
                  helperText={
                    formik.touched.project?.[index]?.total_pages &&
                    formik.errors.project?.[index]?.total_pages &&
                    formik.errors.project?.[index]?.total_pages
                  }
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 ">
                <TextField
                  name={`project[${index}].target_pages`}
                  label="Target pages"
                  className="my-2"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formik.values.project?.[index]?.target_pages || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.project?.[index]?.target_pages &&
                    Boolean(formik.errors.project?.[index]?.target_pages)
                  }
                  helperText={
                    formik.touched.project?.[index]?.target_pages &&
                    formik.errors.project?.[index]?.target_pages &&
                    formik.errors.project?.[index]?.target_pages
                  }
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 align-self-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start date"
                    size="small"
                    value={
                      dayjs(formik.values.project?.[index]?.start_date) || null
                    }
                    onChange={(newValue) => {
                      const Date = dayjs(newValue).format("YYYY-MM-DD");
                      formik.setFieldValue(
                        `project[${index}].start_date`,
                        Date
                      );
                    }}
                    onBlur={formik.handleBlur}
                    slotProps={{
                      textField: {
                        name: `project[${index}].start_date`,
                        error:
                          !!formik.touched.project?.[index]?.start_date &&
                          !!formik.errors.project?.[index]?.start_date,
                        helperText:
                          formik.touched.project?.[index]?.start_date &&
                          formik.errors.project?.[index]?.start_date,
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 align-self-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due date"
                    size="small"
                    value={
                      dayjs(formik.values.project?.[index]?.due_date) || null
                    }
                    onChange={(newValue) => {
                      const Date = dayjs(newValue).format("YYYY-MM-DD");
                      formik.setFieldValue(`project[${index}].due_date`, Date);
                    }}
                    onBlur={formik.handleBlur}
                    slotProps={{
                      textField: {
                        name: `project[${index}].due_date`,
                        error:
                          !!formik.touched.project?.[index]?.due_date &&
                          !!formik.errors.project?.[index]?.due_date,
                        helperText:
                          formik.touched.project?.[index]?.due_date &&
                          formik.errors.project?.[index]?.due_date,
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6 p-0">
                <TextField
                  label="Task Description"
                  name={`project[${index}].project_description`}
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  value={
                    formik.values?.project?.[index].project_description || ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.values.project.length > 1 && (
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
            Add project
          </button>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            style={{
              backgroundColor: "#2280b8",
              color: "#fff",
              fontWeight: "500",
            }}
            disabled={loading ? true : false}
          >
            {loading ? "Loading..." : "SUBMIT PLAN"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EmpTask;
