import type { JSX } from "react";
import { AppLayout } from "../../components/templates/AppLayout";

const Dashboard = async (): Promise<JSX.Element> => {
    return(
        <AppLayout>
            <p>Hello World</p>
        </AppLayout>
    )
}

export { Dashboard }