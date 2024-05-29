import { Box, TableRow, TableCell, Skeleton } from "@mui/material";
import PaginatedTable from "../../components/table/PaginatedTable.component";
import Layout from "../../components/layout/Layout";
import { useAssets } from "../../hooks/useAuthFetcher";
import type { AssetStoredAttributes } from "../../utils/types/attributes";

function Assets() {
  const { data, error } = useAssets(1, 25);
  if (error !== undefined && typeof error === "string") throw new Error(error);
  if (data === undefined) return <Skeleton />;
  return (
    <Layout>
      <Box style={{ width: "100vw", height: "95vh" }}>
        <h1 style={{ marginLeft: "5%" }}>Assets</h1>
        <Box style={{ height: "80%", marginLeft: "5vw", marginRight: "5vw" }}>
          <AssetsTable data={data.data} />
        </Box>
      </Box>
    </Layout>
  );
}

function renderAssetRow(datum: AssetStoredAttributes) {
  const { id, name, modelNumber, status } = datum;
  return (
    <TableRow>
      <TableCell sx={{ border: "1px solid grey" }}>{id}</TableCell>
      <TableCell sx={{ border: "1px solid grey" }}>{name}</TableCell>
      <TableCell sx={{ border: "1px solid grey" }}>{modelNumber}</TableCell>
      <TableCell sx={{ border: "1px solid grey" }}>{status}</TableCell>
      <TableCell sx={{ border: "1px solid grey" }}>{datum.createdAt?.toString()}</TableCell>
    </TableRow>
  );
}

function renderAssetHeaders() {
  return (
    <TableRow>
      <th style={{ border: "1px solid grey" }}>id</th>
      <th style={{ border: "1px solid grey" }}>name</th>
      <th style={{ border: "1px solid grey" }}>modelNumber</th>
      <th style={{ border: "1px solid grey" }}>status</th>
      <th style={{ border: "1px solid grey" }}>createdAt</th>
    </TableRow>
  );
}

interface AssetsTableProps {
  data: AssetStoredAttributes[];
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
