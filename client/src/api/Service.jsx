import Main_Api from "../Auth_Interceptor/MainApi";

export const LoginService = (request) => {
  return Main_Api.post("auth/login", request);
};

export const SendOtpService = (request) => {
  return Main_Api.post("auth/forgetpswd/send-otp", request);
};

export const VerifyOtpService = (request) => {
  return Main_Api.post("auth/forgetpswd/verify-otp", request);
};

export const ResetPswdService = (request) => {
  return Main_Api.post("auth/reset-password", request);
};

export const RegisterService = (request) => {
  return Main_Api.post("auth/register", request);
};

export const VerifyRegisterOtpService = (request) => {
  return Main_Api.post("auth/verify-otp", request);
};

export const LogoutService = (request) => {
  return Main_Api.post("auth/logout", request);
};

export const MrngTaskService = (request) => {
  return Main_Api.post("employee/morning-task", request);
};

export const GetMrngTaskService = (request) => {
  return Main_Api.get("employee/get/morning-task?date=" + request);
};

export const EvngTaskService = (request) => {
  return Main_Api.post("employee/evening-task", request);
};

export const AttendanceService = (request) => {
  return Main_Api.get("employee/emp-attendance?filter_date=" + request);
};

export const UpdateAttendanceService = (request) => {
  return Main_Api.put("/spradmin/update-attendance", request);
};

export const EmpPregressService = (request) => {
  return Main_Api.get("employee/progress-report?filter_date=" + request);
};

export const GetAllEmployee = () => {
  return Main_Api.get("employee/all-employees");
};

export const EditEmployee = (emp) => {
  return Main_Api.put("spradmin/update-employee/" + emp?.id, emp);
};

export const AdminEditEmployee = (emp) => {
  return Main_Api.put("admin/update-employee-status", emp);
};

export const DelEmployee = (emp) => {
  return Main_Api.delete("spradmin/delete-employee/" + emp);
};

export const AddPermission = (request) => {
  return Main_Api.put("employee/add/permission", request);
};

export const AssignTaskService = (request) => {
  return Main_Api.post("admin/assign-task", request);
};

export const removeAssignTaskService = (request) => {
  return Main_Api.delete("employee/remove/assign-task", { data: request });
};

export const GetEmpAssignTaskService = () => {
  return Main_Api.get("employee/employee-tasks");
};

export const setPerformanceService = (request) => {
  return Main_Api.post("admin/assign-performance", request);
};

export const AddProjectService = (request) => {
  return Main_Api.post("admin/add/project", request);
};

export const GetProjectService = () => {
  return Main_Api.get("spradmin/get/projects");
};

export const GetPerformanceService = (date) => {
  return Main_Api.get("spradmin/get_performance?filter_date=" + date);
};

export const GetEmpPerformanceService = (date) => {
  return Main_Api.get("employee/emp/get_performance?filter_date=" + date);
};
