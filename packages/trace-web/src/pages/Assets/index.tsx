import type { JSX } from "react";
import { AppLayout } from "../../components/templates/AppLayout";

const Assets = async (): Promise<JSX.Element> => {
    return(
        <AppLayout>
            <p style={{ color: "white" }}>Assets</p>
        </AppLayout>
    )
}

export { Assets }