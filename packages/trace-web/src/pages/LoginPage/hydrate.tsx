/// <reference lib="dom" />
import { hydrateRoot } from "react-dom/client";
import { Button } from "./button.tsx";
import { apiClient } from "../../config.ts";

const hydrationRoot = document.getElementById("hydrationRoot");
if (hydrationRoot === null) {
	throw new Error("Unable to find hydrationRoot.");
}

const idps = await apiClient.getOidcConfig();
hydrateRoot(hydrationRoot, <Button idps={idps.config} />);
