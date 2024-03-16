import React, { ReactNode, useState, Fragment } from "react";
import {
	Table, TableHead, TableBody, TablePagination, TableFooter, TableRow
} from "@mui/material";

export interface PaginatedTableProps<T> {
	data: T[];
	dataRender: (datum: T) => ReactNode; // Return TableRow
	headersRender: () => ReactNode; // Return TableRow
}

function PaginatedTable<T>(props: PaginatedTableProps<T>) {
	const { data, dataRender, headersRender } = props;
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);

	return (
	<Table sx={{
		border: "1px solid white",
		borderCollapse: "collapse",
	}}>
		<TableHead>
			{headersRender()}
		</TableHead>
		<TableBody>
			{
				data
				.slice(page*rowsPerPage, (page+1)*rowsPerPage)
				.map(dataRender)
				.map((node, idx) => <Fragment key={idx}>{node}</Fragment>)
			}
		</TableBody>
		<TableFooter>
			<TableRow>
				<TablePagination
					count={data.length}
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={(_, newPage) => setPage(newPage)}
					onRowsPerPageChange={(event) => {
						const startIndex = page * rowsPerPage;
						const newRowsPerPage = parseInt(event.target.value, 10);
						setRowsPerPage(newRowsPerPage);
						const newPage = Math.floor(startIndex / newRowsPerPage);
						setPage(newPage);
					}}
				/>
			</TableRow>
		</TableFooter>
	</Table>
	);
}

export default PaginatedTable;
