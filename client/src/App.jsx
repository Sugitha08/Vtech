import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee/*" element={<EmpLayout />}>
              <Route path="todayTask" element={<EmpTask />} />
              <Route path="taskUpdate" element={<EmpUpdate />} />
              <Route path="notification" element={<EmpNotification />} />
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
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
