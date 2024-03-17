import React, { ReactNode, useState } from "react";
import { Box, TableRow, TableCell } from "@mui/material";
import PaginatedTable from "../../components/table/PaginatedTable.component";
import Layout from "../../components/layout/Layout";

// Demonstration of what table needs
interface AssetData {
  id: number;
  field1: string;
  field2: `${boolean}`;
}
const sampleData: AssetData[] = [
  { id: 1, field1: "Value1", field2: "true" },
  { id: 2, field1: "Other Value", field2: "false" },
];

function Assets() {
  for (let i = 0; i < 30; i++) {
    const data = { ...sampleData[1], id: i + 3 };
    sampleData.push(data);
  }
  return (
    <Layout>
      <Box style={{ width: "100vw", height: "95vh" }}>
        <h1 style={{ marginLeft: "5%" }}>Assets</h1>
        <Box style={{ height: "80%", marginLeft: "5vw", marginRight: "5vw" }}>
          <AssetsTable data={sampleData} />
        </Box>
      </Box>
    </Layout>
  );
}

function renderAssetRow(datum: AssetData) {
  const { id, field1, field2 } = datum;
  return (
    <TableRow>
      <TableCell sx={{ border: "1px solid white" }}>{id}</TableCell>
      <TableCell sx={{ border: "1px solid white" }}>{field1}</TableCell>
      <TableCell sx={{ border: "1px solid white" }}>{field2}</TableCell>
    </TableRow>
  );
}

function renderAssetHeaders() {
  return (
    <TableRow>
      <th style={{ border: "1px solid white" }}>id</th>
      <th style={{ border: "1px solid white" }}>field1</th>
      <th style={{ border: "1px solid white" }}>field2</th>
    </TableRow>
  );
}

interface AssetsTableProps {
  data: AssetData[];
}

function AssetsTable({ data }: AssetsTableProps) {
  return (
    <PaginatedTable
      data={data}
      dataRender={renderAssetRow}
      headersRender={renderAssetHeaders}
    />
  );
}

export default Assets;
