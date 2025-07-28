import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

function ProjectDetail() {
  const [searchinputValue, setSearchInputValue] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const employeeData = [];

  const handleSearchInputChange = (event, value) => {
    setSearchInputValue(value);

    // Show options only after typing 2 or more characters
    if (value.length >= 2) {
      const filtered = employeeData.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setSearchOptions(filtered);
    } else {
      setSearchOptions([]);
    }
  };
  return (
    <div>
      <div className="my-3">
        <h6
          style={{
            color: "rgb(34, 128, 184)",
            fontSize: "20px",
            fontWeight: "700",
          }}
          className="mb-0"
        >
          Project Detail
        </h6>
      </div>
      <div className="search-field w-25">
        <Autocomplete
          options={searchOptions}
          inputValue={searchinputValue}
          onInputChange={handleSearchInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Project Name..."
              size="small"
              fullWidth
            />
          )}
        />
      </div>
    </div>
  );
}

export default ProjectDetail;
