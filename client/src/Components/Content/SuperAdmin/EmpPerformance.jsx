import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetEmpPerformanceThunk } from "../../../redux/thunk/EmpPerformanceThunk";
import { Chart } from "primereact/chart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function EmpPerformance() {
  const dispatch = useDispatch();
  const [empPerformace, setEmpPerformance] = useState([]);
  const { performance } = useSelector((state) => state?.Performance);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [filter_date, setFilter_date] = useState(currentDate);

  useEffect(() => {
    dispatch(GetEmpPerformanceThunk(filter_date));
  }, [filter_date]);

  useEffect(() => {
    setEmpPerformance(performance);
  }, [performance]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const labels = empPerformace.map((emp) => emp.employee_name);
    const values = empPerformace.map((emp) => emp.performance_percentage);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: labels,
      datasets: [
        {
          label: "performace",
          backgroundColor: documentStyle.getPropertyValue("#3498db"),
          borderColor: documentStyle.getPropertyValue("#3498db"),
          data: values,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [performance, empPerformace]);
  return (
    <div className="emp-container">
      <div className="d-flex justify-content-between align-items-center my-2">
        <div>
          <h6
            style={{
              color: "rgb(34, 128, 184)",
              fontSize: "20px",
              fontWeight: "700",
            }}
            className="mb-0"
          >
            Employee Performance
          </h6>
        </div>
        <div className="row w-50 justify-content-end">
          <div className="col-lg-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seach date"
                size="small"
                value={dayjs(filter_date) || null}
                onChange={(newValue) => {
                  const date = dayjs(newValue).format("YYYY-MM-DD");
                  setFilter_date(date);
                }}
                slotProps={{
                  textField: {
                    name: "filterDate",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div className="card p-3 mt-4">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default EmpPerformance;
