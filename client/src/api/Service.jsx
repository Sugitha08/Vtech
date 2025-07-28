import Main_Api from "../Auth_Interceptor/MainApi";

export const LoginService = (request) => {
  return Main_Api.post("auth/login", request);
};

export const RegisterService = (request) => {
  return Main_Api.post("auth/register", request);
};

export const LogoutService = (request) => {
  return Main_Api.post("auth/logout", request);
};

export const MrngTaskService = (request) => {
  return Main_Api.post("employee/morning-task", request);
};

export const EvngTaskService = (request) => {
  return Main_Api.post("employee/evening-task", request);
};

export const AttendanceService = (request) => {
  return Main_Api.get("employee/emp-attendance?filter_date=" + request);
};

export const EmpPregressService = (request) => {
  return Main_Api.get("employee/progress-report?filter_date=" + request);
};

export const GetAllEmployee = () => {
  return Main_Api.get("employee/all-employees");
};

export const AssignTaskService = (request) => {
  return Main_Api.post("admin/assign-task", request);
};

export const GetEmpAssignTaskService = () => {
  return Main_Api.get("employee/employee-tasks");
};

export const setPerformanceService = (request) => {
  return Main_Api.post("admin/assign-performance" , request);
};
