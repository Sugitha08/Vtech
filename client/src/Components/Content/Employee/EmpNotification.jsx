import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DelEmpAssignTaskThunk,
  GetEmpAssignTaskThunk,
} from "../../../redux/thunk/AssignTask";
import { Button } from "@mui/material";

function EmpNotification() {
  const dispatch = useDispatch();
  const { getEmpload , getEmptask } = useSelector((state) => state.AssignTask);
  const [empTask, setEmpTask] = useState([]);

  useEffect(() => {
    setEmpTask(getEmptask);
  }, [getEmptask]);

  useEffect(() => {
    dispatch(GetEmpAssignTaskThunk());
  }, []);

  const handleCompleteTask = (id) => {
    dispatch(DelEmpAssignTaskThunk({ task_id: id }))
      .unwrap()
      .then(() => dispatch(GetEmpAssignTaskThunk()));
  };
  return (
    <div className="emp-task card shadow" style={{ padding: "20px" }}>
      <h5 style={{ color: "#2EA3F2" }}>Notification - Today Task</h5>
      <div>
        <table className="table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Book Type</th>
              <th>Book Title</th>
              <th>ISBN Number</th>
              <th>Target Pages</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {getEmpload ? <div>Getting Task...</div> : empTask?.length > 0 ? (
              empTask?.map((task, index) => (
                <tr>
                  <td>{task?.Project_type}</td>
                  <td>{task?.book_title}</td>
                  <td>{task?.book_isbn}</td>
                  <td>{task?.target_pages}</td>
                  <td>{task?.start_date}</td>
                  <td>{task?.due_date}</td>
                  <td>{task?.task_note ? task?.task_note : "-"}</td>
                  <td>
                    <Button
                      type="button"
                      sx={{
                        padding: "4px 5px",
                        backgroundColor: "green",
                        color: "#f6f6f6",
                      }}
                      onClick={() => handleCompleteTask(task?.task_id)}
                    >
                      Complete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <div>No Task Assigned Yet</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmpNotification;
