import React from "react";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Paper } from "@mui/material";
import { TotalInventoryCount } from "../../../../../api/src/utils/types/attributeTypes";

type ChartViewProps = {
  data: TotalInventoryCount[];
};

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
                data: data.map((i) => i.assets),
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
