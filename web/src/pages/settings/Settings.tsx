import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

function Settings() {
	return (
		<Box style={{ width: "100vw", height: "95vh" }}>
			<h1 style={{ marginLeft: "5%" }}>Settings</h1>
			<Box style={{ height: "80%" }}>
				<SettingsGrid />
			</Box>
		</Box>
	);
}

function SettingsGrid() {
	return (
		<table style={{
			width: "100%",
			height: "100%",
			textAlign: "center",
			borderSpacing: "5vw"
		}}>
			<tbody>
			<tr style={{ height: "50%" }}>
				<td><SettingsPlaceholder /></td>
				<td><SettingsPlaceholder /></td>
				<td><SettingsPlaceholder /></td>
			</tr>
			<tr style={{ height: "50%" }}>
				<td><SettingsPlaceholder /></td>
				<td><SettingsPlaceholder /></td>
				<td><SettingsPlaceholder /></td>
			</tr>
			</tbody>
		</table>
	);
}

function SettingsPlaceholder() {
	return <Card style={{ height: "100%", width: "100%", background: '#808080' }} />
}

export default Settings;
