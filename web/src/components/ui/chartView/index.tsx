import React from "react";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Paper } from "@mui/material";
import type { TotalInventoryCount } from "../../../utils/types/attributes";

interface ChartViewProps {
  data: TotalInventoryCount | undefined;
}

Chart.register(ArcElement, Tooltip, Legend);

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ maxWidth: "40vw", maxHeight: "40vh" }}>
        <Doughnut
          data={{
            labels: ["Assets"],
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
