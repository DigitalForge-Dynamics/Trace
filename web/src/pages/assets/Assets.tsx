import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

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
	return (
		<Box sx={{ overflow: "scroll" }}>
		<table style={{
			width: "90%",
			height: "100%",
			textAlign: "center",
			marginLeft: "5vw",
			marginRight: "5vw",
			border: "1px solid white",
			borderCollapse: "collapse",
			overflow: "scroll"
		}}>
			<thead>
			<tr>
				{headers.map((header, idx) => <th key={idx} style={{ border: "1px solid white" }}>{header}</th>)}
			</tr>
			</thead>
			<tbody>
			{data.map((datum, idx) => (<tr key={idx}>
				{headers.map((header, idx) => <td key={idx} style={{ border: "1px solid white" }}>{datum[header]}</td>)}
			</tr>))}
			</tbody>
		</table>
		</Box>
	);
}

export default Assets;
