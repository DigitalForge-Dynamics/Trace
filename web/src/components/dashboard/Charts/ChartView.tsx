import React from "react";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Paper } from "@mui/material";
import type { TotalInventoryCount } from "../../../utils/types/attributes";

interface ChartViewProps {
  labels: Array<string>;
  data?: TotalInventoryCount | undefined;
}

Chart.register(ArcElement, Tooltip, Legend);

const ChartView: React.FC<ChartViewProps> = ({ labels, data }) => {
  return (
    <Paper elevation={3} sx={{ backgroundColor: "whitesmoke", p: 1 }}>
      <Box sx={{ maxWidth: "80vw", maxHeight: "80vh" }}>
        <Doughnut
          data={{
            labels: labels,
            datasets: [
              {
                label: "Total Assets",
                data: data ? [data.assets] : undefined,
                backgroundColor: ["green", "blue"],
              },
            ],
          }}
        />
      </Box>
    </Paper>
  );
};

export default ChartView;
