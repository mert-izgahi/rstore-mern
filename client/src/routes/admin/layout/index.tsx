import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/use-auth-store"
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom"
import AppSidebar from "./app-sidebar";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import NotificationsMenu from "@/components/shared/notifications-menu";

const Layout = () => {
    const { isAuthenticated, account } = useAuthStore();
    const isAllowed = useMemo(() => account?.role === "admin" || account?.role === "guest", [account]);

    if (!isAuthenticated || !isAllowed) {
        return <Navigate to="/" />
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="h-16 flex items-center justify-between px-4 bg-sidebar border-b border-sidebar-border">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <ThemeToggler />
                        <NotificationsMenu />
                    </div>
                </header>

                <div className="py-12">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}

export { Layout as AdminLayout }