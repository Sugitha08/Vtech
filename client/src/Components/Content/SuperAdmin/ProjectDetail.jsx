import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectThunk } from "../../../redux/thunk/ProjectThunk";

function ProjectDetail() {
  const dispatch = useDispatch();
  const [allProject, setAllProject] = useState([]);
  const {loading, project } = useSelector((state) => state?.Project);
  useEffect(() => {
    dispatch(GetProjectThunk());
  }, []);

  useEffect(() => {
    setAllProject(project);
  }, [project]);

  const [searchTerm, setSearchTerm] = useState("");
  const filterEmpData = allProject?.filter(
    (data) =>
      data?.client_name
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.type
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.project_title
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      data?.book_isbn?.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

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
        <TextField
          size="small"
          variant="outlined"
          label="Search by Project Name..."
          value={searchTerm}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="all-project mt-2">
        <TableContainer component={Paper}>
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                border: "0.2px solid #eeeeee",
              },
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: "bold",
                    padding: "7px",
                    textAlign: "center",
                  },
                }}
              >
                <TableCell>Client Name</TableCell>
                <TableCell>Project Type</TableCell>
                <TableCell>Project Title</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Total Pages</TableCell>
                <TableCell>Project Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <div>Getting Proect Details...</div>:filterEmpData?.length > 0 ? (
                filterEmpData?.map((data) => (
                  <TableRow
                    key={data?.project_id}
                    sx={{ "& td": { padding: "7px" } }}
                  >
                    <TableCell align="center">{data?.client_name}</TableCell>
                    <TableCell align="center">{data?.type}</TableCell>
                    <TableCell align="center">{data?.project_title}</TableCell>
                    <TableCell align="center">{data?.book_isbn}</TableCell>
                    <TableCell align="center">{data?.total_pages}</TableCell>
                    <TableCell align="center">{data?.project_date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="p-3">
                    No project
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ProjectDetail;
