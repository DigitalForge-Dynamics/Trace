import { Box, TableRow, TableCell, Skeleton } from "@mui/material";
import PaginatedTable from "../../components/table/PaginatedTable.component";
import Layout from "../../components/layout/Layout";
import { useAssets } from "../../hooks/useAuthFetcher";
import type { AssetStoredAttributes } from "../../utils/types/attributes";

function Assets() {
  const { data, error } = useAssets();
  if (error !== undefined) throw new Error(error);
  if (data === undefined) return <Skeleton />;
  return (
    <Layout>
      <Box style={{ width: "100vw", height: "95vh" }}>
        <h1 style={{ marginLeft: "5%" }}>Assets</h1>
        <Box style={{ height: "80%", marginLeft: "5vw", marginRight: "5vw" }}>
          <AssetsTable data={data} />
        </Box>
      </Box>
    </Layout>
  );
}

function renderAssetRow(datum: AssetStoredAttributes) {
  //const { id, field1, field2 } = datum;
  const { id } = datum;
  const field1 = "TODO";
  const field2 = "TODO";
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
