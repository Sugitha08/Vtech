import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { RegisterThunk } from "../../redux/thunk/RegisterThunk";

function Register() {
  const dispatch = useDispatch();
  const initialValues = {
    fname: "",
    role: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
    checkIn: null,
    checkOut: null,
  };
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const [passwordCVisible, setPasswordCVisibile] = useState(false);
  const Emp_role = [
    { label: "Employee", value: "employee" },
    { label: "Admin", value: "admin" },
    { label: "SuperAdmin", value: "superadmin" },
  ];

  const passwordsyntax = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const validation = Yup.object().shape({
    fname: Yup.string()
      .min(3, "Name must have at least 4 characters")
      .required("*This field is required"),
    username: Yup.string()
      .min(3, "Username must have at least 5 characters")
      .required("*This field is required"),
    role: Yup.string().required("*This field is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("*This field is required"),
    password: Yup.string()
      .min(6, "password must have atleast 6 characters")
      // .matches(passwordsyntax, "create a strong password")
      .required("*this field is required"),
    cpassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "confirm password and password are not matching"
      )
      .required("*this field is required"),
    checkIn: Yup.string().required("*This field is required"),
    checkOut: Yup.string().required("*This field is required"),
  });
  const navigate = useNavigate()

  const handleRegister = ({ values, resetForm }) => {
    const payload = {
      name: values.fname,
      email: values.email,
      password: values.password,
      role: values.role,
      username: values.username,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
    };
    dispatch(RegisterThunk(payload))
      .unwrap()
      .then(() => {
        navigate("/")
      });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleRegister({ values, resetForm });
    },
  });

  return (
    <div className="Login-container">
      <div className="Reg-content shadow">
        <h4 className="text-center" style={{ color: "rgb(81 50 223)" }}>
          Employee Register
        </h4>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <TextField
                label="Full Name"
                className="my-2"
                variant="outlined"
                size="small"
                fullWidth
                name="fname"
                value={formik.values.fname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fname && Boolean(formik.errors.fname)}
                helperText={formik.touched.fname && formik.errors.fname}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 align-self-center">
              <Autocomplete
                options={Emp_role}
                getOptionLabel={(option) => option?.label}
                onChange={(event, newValue) => {
                  formik.setFieldValue("role", newValue?.value);
                }}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    name="role"
                    size="small"
                    fullWidth
                    error={formik.touched.role && formik.errors.role}
                    helperText={formik.touched.role && formik.errors.role}
                  />
                )}
              />
            </div>
          </div>
          <TextField
            label="Username"
            className="my-2"
            variant="outlined"
            size="small"
            fullWidth
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            label="Email"
            className="my-2"
            variant="outlined"
            size="small"
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            className="my-2"
            variant="outlined"
            size="small"
            fullWidth
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: "pointer" }}>
                    {passwordVisible ? (
                      <FaEyeSlash onClick={() => setPasswordVisibile(false)} />
                    ) : (
                      <FaEye onClick={() => setPasswordVisibile(true)} />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Confirm Password"
            type={passwordCVisible ? "text" : "password"}
            className="my-2"
            variant="outlined"
            size="small"
            fullWidth
            name="cpassword"
            value={formik.values.cpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cpassword && Boolean(formik.errors.cpassword)}
            helperText={formik.touched.cpassword && formik.errors.cpassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: "pointer" }}>
                    {passwordCVisible ? (
                      <FaEyeSlash onClick={() => setPasswordCVisibile(false)} />
                    ) : (
                      <FaEye onClick={() => setPasswordCVisibile(true)} />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  label="Check-in"
                  size="small"
                  className="my-2"
                  fullWidth
                  onChange={(newValue) => {
                    const time = newValue.format("hh:mm A");
                    console.log(time);

                    formik.setFieldValue("checkIn", time);
                  }}
                  onBlur={formik.handleBlur}
                  slotProps={{
                    textField: {
                      name: "checkIn",
                      size: "small",
                      fullWidth: true,
                      error: formik.touched.checkIn && formik.errors.checkIn,
                      helperText:
                        formik.touched.checkIn && formik.errors.checkIn,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  label="Check-Out"
                  size="small"
                  className="my-2"
                  fullWidth
                  onChange={(newValue) => {
                    const time = newValue.format("hh:mm A");
                    formik.setFieldValue("checkOut", time);
                  }}
                  onBlur={formik.handleBlur}
                  slotProps={{
                    textField: {
                      name: "checkOut",
                      size: "small",
                      fullWidth: true,
                      error: formik.touched.checkOut && formik.errors.checkOut,
                      helperText:
                        formik.touched.checkOut && formik.errors.checkOut,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div style={{ fontSize: "12px" }}>
            Already have an account? <Link to="/">Login</Link>
          </div>
          <div className="d-flex justify-content-end  my-1  ">
            <button type="submit" className="btn btn-success">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
