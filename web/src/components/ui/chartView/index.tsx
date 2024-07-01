import React from "react";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box } from "@mui/material";
import type { TotalInventoryCount } from "../../../utils/types/attributes";

interface ChartViewProps {
  data: TotalInventoryCount | undefined;
}

Chart.register(ArcElement, Tooltip, Legend);

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  return (
    <>
      <Box sx={{ maxWidth: "50vw", maxHeight: "50vh" }}>
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
    </>
  );
};

export default ChartView;
