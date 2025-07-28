import { combineReducers } from "redux";
import LoginReducer from "./EmpReducer/LoginReducer";
import RegisterReducer from "./EmpReducer/RegisterReducer";
import LogoutReducer from "./EmpReducer/LogoutReducer";
import AddmrngTaskReducer from "./EmpReducer/AddmrngTaskReducer";
import AddevngTaskReducer from "./EmpReducer/AddevngTaskReducer";
import AttendanceReducer from "./EmpReducer/AttendanceReducer";
import EmpProgressReducer from "./EmpReducer/EmpProgressReducer";
import EmployeeReducer from "./EmpReducer/EmployeeReducer";
import AssignTaskReducer from "./EmpReducer/AssigntaskReducer";

const RootReducer = combineReducers({
  Login: LoginReducer,
  Logout: LogoutReducer,
  Register: RegisterReducer,
 
  Employee:EmployeeReducer,
  MorningTask: AddmrngTaskReducer,
  EveningTask: AddevngTaskReducer,
  EmpAttendance: AttendanceReducer,
  EmpProgress: EmpProgressReducer,
  AssignTask: AssignTaskReducer,
});

export default RootReducer;
