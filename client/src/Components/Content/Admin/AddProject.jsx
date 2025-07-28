import { TextField } from "@mui/material";
import React from "react";

function AddProject() {
  return (
    <div className="addproject">
      <div className="my-3">
        <h6
          style={{
            color: "rgb(34, 128, 184)",
            fontSize: "20px",
            fontWeight: "700",
          }}
          className="mb-0"
        >
          Project Registration
        </h6>
      </div>
      <div className="card p-3 ">
        <div className="row">
          <div className="col-lg-3">
            <TextField label="Project Name" size="small" fullWidth />
          </div>
          <div className="col-lg-3">
            <TextField
              size="small"
              variant="outlined"
              label="Client Name"
              fullWidth
            />
          </div>
          <div className="col-lg-6">
            <TextField
              size="small"
              variant="outlined"
              label="Description"
              fullWidth
            />
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn"
            style={{
              backgroundColor: "#2280b8",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProject;
