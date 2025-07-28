import { Button, InputAdornment, TextField } from "@mui/material";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginThunk } from "../../redux/thunk/LoginThunk";

function Login() {
  const LoginStatus = localStorage.getItem("jwt_token") ? true : false;
  const user_role = localStorage.getItem("user_role");
  const initialValues = {
    username: "",
    password: "",
  };
  const { data, loading } = useSelector((state) => state.Login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const validation = Yup.object().shape({
    username: Yup.string().required("*This field is required"),
    password: Yup.string().required("*this field is required"),
  });

  const handleLogin = ({ values, resetForm }) => {
    const checkIn = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const currentDate = new Date().toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
    });

    const payload = {
      username: values?.username,
      password: values?.password,
      checkIn: checkIn,
      date: currentDate,
    };
    dispatch(LoginThunk(payload))
      .unwrap()
      .then(() => {
        resetForm();
      });
  };
  useEffect(() => {
    if (LoginStatus && user_role) {
      if (user_role === "employee") {
        navigate("/employee/todayTask");
      } else if (user_role === "admin") {
        navigate("/admin/attendance");
      } else if (user_role === "superadmin") {
        navigate("/superadmin/Emp-attendance");
      }
    }
  }, [user_role, data]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleLogin({ values, resetForm });
    },
  });
  return (
    <div className="Login-container">
      <div className="login-content shadow">
        <h4 className="text-center" style={{ color: "rgb(81 50 223)" }}>
          Employee Login
        </h4>
        <div style={{ fontSize: "12px" }} className="mt-3">
          New Employee? <Link to="/register">Register</Link>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Username"
            className="my-3"
            variant="outlined"
            size="small"
            fullWidth
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={
              formik.touched.username &&
              formik.errors.username &&
              formik.errors.username
            }
          />
          <TextField
            type={passwordVisible ? "text" : "password"}
            label="Password"
            className="my-2"
            variant="outlined"
            size="small"
            fullWidth
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password &&
              formik.errors.password &&
              formik.errors.password
            }
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
          <a href="" style={{ fontSize: "12px" }}>
            Forgot password
          </a>
          <div className="d-flex justify-content-end  my-2">
            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: "green", color: "#f6f6f6" }}
              loading={loading ? true : false}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
