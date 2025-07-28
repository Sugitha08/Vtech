import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetEmpAssignTaskThunk } from "../../../redux/thunk/AssignTask";

function EmpNotification() {
  const dispatch = useDispatch();
  const { getEmptask } = useSelector((state) => state.AssignTask);
  const [empTask, setEmpTask] = useState([]);

  useEffect(() => {
    setEmpTask(getEmptask);
  }, [getEmptask]);

  useEffect(() => {
    dispatch(GetEmpAssignTaskThunk());
  }, []);
  return (
    <div className="emp-task card shadow" style={{ padding: "20px" }}>
      <h5 style={{ color: "#2EA3F2" }}>Notification</h5>
      <div>
        <h6>Task</h6>
        {empTask?.length > 0 ? (
          empTask?.map((task, index) => (
            <div className="d-flex gap-4 align-items-center" key={index}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: task?.source === "error" ? "red" : "green",
                }}
              ></div>
              <div>
                <strong>Book Title :</strong> {task?.book_title}
              </div>
              <div>
                <strong>Book ISBN :</strong> {task?.book_isbn}
              </div>
              <div>
                <strong>Target Page :</strong> {task?.target_pages}
              </div>
              <div>
                <strong>Start Date :</strong> {task?.start_date}
              </div>
              <div>
                <strong>Due Date :</strong> {task?.due_date}
              </div>
              <div>
                <strong>Task :</strong> {task?.task_note}
              </div>
            </div>
          ))
        ) : (
          <div>No Notification</div>
        )}
      </div>
    </div>
  );
}

export default EmpNotification;
