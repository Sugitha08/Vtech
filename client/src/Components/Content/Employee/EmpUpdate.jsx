import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
import { useDispatch } from "react-redux";
import { AddevngTaskThunk } from "../../../redux/thunk/Addevngtask";

function EmpUpdate() {
  const dispatch = useDispatch();
  const initialValues = {
    project: [
      {
        project_title: "",
        book_isbn: null,
        completed_pages: null,
        incompleted_pages: null,
        end_date: null,
        is_contentExt_pending: false,
        is_styleview_pending: false,
        is_packagecreate_pending: false,
        is_validation_pending: false,
        is_compare_pending: false,
        is_qc_pending: false,
      },
    ],
    status: "",
  };

  const validation = Yup.object().shape({
    status: Yup.string()
      .min(3, "Title must have at least 10 characters")
      .required("*This field is required"),
    project: Yup.array().of(
      Yup.object().shape({
        project_title: Yup.string()
          .min(3, "Title must have at least 3 characters")
          .required("*This field is required"),
        book_isbn: Yup.number()
          .typeError("Must be Number")
          .required("*This field is required"),
      })
    ),
  });

  const handleAddUpdate = (values, resetForm) => {
    console.log("dsfsdf");
    
    const payload = {
      tasks: values?.project,
    };
    dispatch(AddevngTaskThunk(payload))
      .unwrap()
      .then(() => resetForm());
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      console.log("submit");
      
      handleAddUpdate(values, resetForm);
    },
  });

  const handleFieldAdd = () => {
    const newProject = {
      project_title: "",
      completed_pages: null,
      incompleted_pages: null,
      end_date: null,
      is_contentExt_pending: false,
      is_styleview_pending: false,
      is_packagecreate_pending: false,
      is_validation_pending: false,
      is_compare_pending: false,
      is_qc_pending: false,
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
      <h5 style={{ color: "#2EA3F2" }}>Final Work Update</h5>
      <form onSubmit={formik.handleSubmit}>
        {formik?.values?.project?.length > 0 &&
          formik?.values?.project?.map((data, index) => (
            <div className="task-form ">
              <div className="row">
                <div className="col-lg-3">
                  <TextField
                    label="Enter Title"
                    name={`project[${index}].project_title`}
                    className="my-3"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.project[index].project_title}
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
                <div className="col-lg-3 col-md-6 col-sm-12 align-self-center">
                  <TextField
                    label="Enter book ISBN"
                    name={`project[${index}].book_isbn`}
                    className="my-2"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.project[index].book_isbn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.project?.[index]?.book_isbn &&
                      Boolean(formik.errors.project?.[index]?.book_isbn)
                    }
                    helperText={
                      (formik.touched.project?.[index]?.book_isbn &&
                        formik.errors.project?.[index]?.book_isbn &&
                        formik.errors.project?.[index]?.book_isbn) ||
                      ""
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <TextField
                    label="Completed pages"
                    name={`project[${index}].completed_pages`}
                    className="my-3"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.project[index].completed_pages}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-lg-2">
                  <TextField
                    label="Incomplete pages"
                    className="my-3"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name={`project[${index}].incompleted_pages`}
                    value={formik.values.project[index].incompleted_pages}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-lg-2 align-self-center">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End date"
                      size="small"
                      onChange={(newValue) => {
                        formik.setFieldValue(
                          `project[${index}].end_date`,
                          newValue
                        );
                      }}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        textField: {
                          name: `project[${index}].end_date`,
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div>
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{ margin: "0", color: "#4a4747", fontWeight: "600" }}
                  >
                    Pending
                  </FormLabel>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      name={`project[${index}].is_contentExt_pending`}
                      value={formik.values.project[index].is_contentExt_pending}
                      control={
                        <Checkbox
                          checked={
                            formik.values.project[index].is_contentExt_pending
                          }
                          onChange={formik.handleChange}
                        />
                      }
                      label="Content Extraction"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      name={`project[${index}].is_styleview_pending`}
                      value={formik.values.project[index].is_styleview_pending}
                      control={
                        <Checkbox
                          checked={
                            formik.values.project[index].is_styleview_pending
                          }
                          onChange={formik.handleChange}
                        />
                      }
                      label="Styling and View"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      name={`project[${index}].is_packagecreate_pending`}
                      value={
                        formik.values.project[index].is_packagecreate_pending
                      }
                      control={
                        <Checkbox
                          checked={
                            formik.values.project[index]
                              .is_packagecreate_pending
                          }
                          onChange={formik.handleChange}
                        />
                      }
                      label="Package-creation"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={formik.values.project[index].is_validation_pending}
                      name={`project[${index}].is_validation_pending`}
                      control={
                        <Checkbox
                          checked={
                            formik.values.project[index].is_validation_pending
                          }
                          onChange={formik.handleChange}
                        />
                      }
                      label="Validation"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      name={`project[${index}].is_compare_pending`}
                      value={formik.values.project[index].is_compare_pending}
                      control={
                        <Checkbox
                          checked={
                            formik.values.project[index].is_compare_pending
                          }
                          onChange={formik.handleChange}
                        />
                      }
                      label="Compare"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      name={`project[${index}].is_qc_pending`}
                      value={formik.values.project[index].is_qc_pending}
                      control={
                        <Checkbox
                          checked={formik.values.project[index].is_qc_pending}
                          onChange={formik.handleChange}
                        />
                      }
                      label="QC check"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
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
            className="btn mt-1"
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

        <div className="col-lg-12">
          <TextField
            label="Status"
            name="status"
            className="my-3"
            variant="outlined"
            size="small"
            multiline
            minRows={2}
            fullWidth
            value={formik.values.status}
            onChange={formik.handleChange}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#2280b8",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            SUBMIT STATUS
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpUpdate;
