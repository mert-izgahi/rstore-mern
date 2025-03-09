import { useAuthStore } from "@/store/use-auth-store"
import { Navigate, Outlet } from "react-router-dom"

const Layout = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}

export { Layout as AccountLayout }