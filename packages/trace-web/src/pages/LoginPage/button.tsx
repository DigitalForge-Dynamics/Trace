"use client";

import type { FC } from "react";
import { genUserManager } from "../../config.ts";

const onClick = (idps: any[]) => () => {
	const select = document.getElementById("idp") as HTMLSelectElement | null;
	if (!select) {
		throw new Error("Unable to locate select element.");
	}
	const idpUid = select.value;
	const idp = idps.find((idp) => idp.uid === idpUid);
	if (!idp) {
		throw new Error("Unable to match selected IdP to configured IdPs.");
	}
	const userManager = genUserManager(idp);
	userManager.signinRedirect();
};


const Button: FC<{idps: unknown[]}> = ({idps}) => <button id="button" onClick={onClick(idps)}>Login</button>;

export { Button };
