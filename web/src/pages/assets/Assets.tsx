import React, { ReactNode, useState } from "react";
import { Box, Table, TableHead, TableBody, TablePagination, TableRow, TableCell, TableFooter } from "@mui/material";

// Demonstration of what table needs
interface TableData {
	id: number;
	field1: string;
	field2: `${boolean}`;
	[key: string]: ReactNode;
}
const headers: Array<keyof TableData> = ['id', 'field1', 'field2'];
const sampleData: TableData[] = [
	{ id: 1, field1: 'Value1', field2: "true" },
	{ id: 2, field1: 'Other Value', field2: "false" },
];


function Assets() {
	for (let i=0; i<30; i++) {
		const data = { ...sampleData[1], id: i+3 };
		sampleData.push(data);
	}
	return (
		<Box style={{ width: "100vw", height: "95vh" }}>
			<h1 style={{ marginLeft: "5%" }}>Assets</h1>
			<Box style={{ height: "80%" }}>
				<AssetsTable headers={headers} data={sampleData} />
			</Box>
		</Box>
	);
}

interface AssetsTableProps<T> {
	headers: Array<keyof T & ReactNode>,
	data: T[],
}

function AssetsTable<T extends Record<string, ReactNode>>({ headers, data }: AssetsTableProps<T>) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	return (
		<Box sx={{ overflow: "scroll" }}>
		<Table sx={{
			width: "90%",
			height: "100%",
			textAlign: "center",
			marginLeft: "5vw",
			marginRight: "5vw",
			border: "1px solid white",
			borderCollapse: "collapse",
			overflow: "scroll"
		}}>
			<TableHead>
			<TableRow>
				{headers.map((header, idx) => <th key={idx} style={{ border: "1px solid white" }}>{header}</th>)}
			</TableRow>
			</TableHead>
			<TableBody>
			{data
			.slice(page*rowsPerPage, (page+1)*rowsPerPage)
			.map((datum, idx) => (
				<TableRow key={idx}>
					{headers.map((header, idx) => <TableCell key={idx} style={{ border: "1px solid white" }}>{datum[header]}</TableCell>)}
				</TableRow>
			))}
			</TableBody>
			<TableFooter>
				<TablePagination
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(_, newPage: number) => setPage(newPage)}
					onRowsPerPageChange={(event) => {
						const startIndex = page * rowsPerPage;
						setRowsPerPage(parseInt(event.target.value, 10));
						const newPage = startIndex / rowsPerPage;
						setPage(newPage);
					}}
				/>
			</TableFooter>
		</Table>
		</Box>
	);
}

export default Assets;
