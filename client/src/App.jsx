import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { lazy, Suspense } from "react";
const EmpUpdate = lazy(() => import("./Components/Content/Employee/EmpUpdate"));
const Register = lazy(() => import("./Components/Authentication/Register"));
const Login = lazy(() => import("./Components/Authentication/Login"));
const EmpLayout = lazy(() => import("./Components/Layout/EmpLayout/EmpLayout"));
const EmpTask = lazy(() => import("./Components/Content/Employee/EmpTask"));
const EmpNotification = lazy(() =>
  import("./Components/Content/Employee/EmpNotification")
);
const AdminLayout = lazy(() =>
  import("./Components/Layout/AdminLayout/AdminLayout")
);
const AttendanceTracker = lazy(() =>
  import("./Components/Content/Admin/AttendanceTracker")
);
const ProgressTracker = lazy(() =>
  import("./Components/Content/Admin/ProgressTracker")
);
const TaskAssign = lazy(() => import("./Components/Content/Admin/TaskAssign"));
const AddProject = lazy(() => import("./Components/Content/Admin/AddProject"));
const SuperAdminLayout = lazy(() =>
  import("./Components/Layout/SuperAdminLayout/SuperAdminLayout")
);
const EmpProgress = lazy(() =>
  import("./Components/Content/SuperAdmin/EmpPrgress")
);
const EmpAttendance = lazy(() =>
  import("./Components/Content/SuperAdmin/EmpAttendance")
);
const ProjectDetail = lazy(() =>
  import("./Components/Content/SuperAdmin/ProjectDetail")
);
import { ToastContainer } from "react-toastify";
import EmpPermission from "./Components/Content/Employee/EmpPermission";
import EmpPerformance from "./Components/Content/SuperAdmin/EmpPerformance";
import EmpProfile from "./Components/Content/Employee/EMpProfile";
import ForgotPswd from "./Components/Authentication/ForgotPswd";
import Employees from "./Components/Content/SuperAdmin/Employees";

function App() {
  const token = localStorage.getItem("jwt_token") ? true : false;
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resetpswd" element={<ForgotPswd />} />
            {/* {token ? ( */}
            <>
              <Route path="/employee/*" element={<EmpLayout />}>
                <Route path="todayTask" element={<EmpTask />} />
                <Route path="taskUpdate" element={<EmpUpdate />} />
                <Route path="notification" element={<EmpNotification />} />
                <Route path="permission" element={<EmpPermission />} />
                <Route path="Profile" element={<EmpProfile />} />
              </Route>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="attendance" element={<AttendanceTracker />} />
                <Route path="progress" element={<ProgressTracker />} />
                <Route path="taskassign" element={<TaskAssign />} />
                <Route path="addproject" element={<AddProject />} />
              </Route>
              <Route path="/superadmin/*" element={<SuperAdminLayout />}>
                <Route path="Emp-attendance" element={<EmpAttendance />} />
                <Route path="Emp-progress" element={<EmpProgress />} />
                <Route path="project" element={<ProjectDetail />} />
                <Route path="performance" element={<EmpPerformance />} />
                <Route path="employees" element={<Employees />} />
              </Route>
            </>
            {/* ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )} */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
