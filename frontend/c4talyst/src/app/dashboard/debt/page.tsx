import { Debt } from "@/components/component/dashboard/debt/debt";
import Dashboard from "@/components/component/dashboard/dashboard";
import PrivateRoute from "@/components/component/auth/PrivateRoute";

export default function Page() {
    return (
        <PrivateRoute>
            <Dashboard>
                <Debt />
            </Dashboard>
        </PrivateRoute>
    );
}