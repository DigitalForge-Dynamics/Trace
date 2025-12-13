import type { JSX } from "react";
import { AppLayout } from "../../components/templates/AppLayout";

const Dashboard = async (): Promise<JSX.Element> => {
    return(
        <AppLayout>
            <p style={{ color: "white" }}>Dashboard</p>
        </AppLayout>
    )
}

export { Dashboard }