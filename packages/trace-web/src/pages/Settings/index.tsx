import type { JSX } from "react";
import { AppLayout } from "../../components/templates/AppLayout";

const Settings = async (): Promise<JSX.Element> => {
    return(
        <AppLayout>
            <p style={{ color: "white" }}>Settings</p>
        </AppLayout>
    )
}

export { Settings }