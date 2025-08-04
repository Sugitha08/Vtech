import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RegisterThunk,
  VerifyRegOtpThunk,
} from "../../redux/thunk/RegisterThunk";
import AuthenticateUser from "./AuthenticateUser";

function Register() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.Register);
  const initialValues = {
    fname: "",
    role: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  };
  const [verifyLoad, setVerifyLoad] = useState(false);
  const [token, setTokens] = useState();

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
  });
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const handleRegister = ({ values, resetForm }) => {
    const payload = {
      name: values.fname,
      email: values.email,
      password: values.password,
      role: values.role,
      username: values.username,
      status:"active"
    };
    if (values.role === "superadmin" || values.role === "admin") {
      dispatch(RegisterThunk(payload))
        .unwrap()
        .then(() => {
          setOpenModal(true);
        });
    } else {
      dispatch(RegisterThunk(payload))
        .unwrap()
        .then(() => {
          navigate("/");
        });
    }
  };

  const handleVerifyOtp = () => {
    setVerifyLoad(true);
    const payload = {
      name: formik.values.fname,
      email: formik.values.email,
      password: formik.values.password,
      role: formik.values.role,
      username: formik.values.username,
      otp: token,
    };
    dispatch(VerifyRegOtpThunk(payload))
      .unwrap()
      .then(() => {
        setTokens(null);
        handleClose();
        navigate("/");
        setVerifyLoad(false);
      })
      .catch((err) => {
        setVerifyLoad(false);
      });
  };

  const handleClose = () => {
    setOpenModal(false);
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
          <div style={{ fontSize: "12px" }}>
            Already have an account? <Link to="/">Login</Link>
          </div>
          <div className="d-flex justify-content-end  my-1  ">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading ? true : false}
            >
              {loading ? "Loading" : "Register"}
            </button>
          </div>
        </form>
      </div>
      <AuthenticateUser
        open={openModal}
        handleClose={handleClose}
        token={token}
        setTokens={setTokens}
        handleVerifyOtp={handleVerifyOtp}
        verifyLoad={verifyLoad}
      />
    </div>
  );
}

export default Register;
