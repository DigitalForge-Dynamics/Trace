import React from "react";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Paper } from "@mui/material";

Chart.register(ArcElement, Tooltip, Legend);

const ChartView: React.FC = () => {
  return (
    <>
      <Paper sx={{ maxWidth: "20vw", maxHeight: "20vh" }}>
        <Doughnut
          data={{
            labels: ["Assets", "Licenses"],
            datasets: [
              {
                label: "Total Assets",
                data: [1, 2],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                ],
              },
            ],
          }}
        />
      </Paper>
    </>
  );
};

export default ChartView;
