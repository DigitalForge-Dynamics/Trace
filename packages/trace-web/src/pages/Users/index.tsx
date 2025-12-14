import type { JSX } from "react";
import { AppLayout } from "../../components/templates/AppLayout";

const Users = async (): Promise<JSX.Element> => {
    return(
        <AppLayout>
            <p style={{ color: "white" }}>Users</p>
        </AppLayout>
    )
}

export { Users }