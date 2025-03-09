import Logo from "@/components/shared/logo";
import UserButton from "@/components/shared/user-button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import {
    LayoutDashboard as HomeIcon,
    Users as CustomersIcon,
    Package2 as OrdersIcon,
    Microwave as ProductsIcon,
    Settings as SettingsIcon,
    Star as ReviewsIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AppSidebar() {
    const location = useLocation();
    const { account } = useAuthStore();
    const mainLinks = [
        {
            name: "Home",
            to: "/admin/overview",
            icon: HomeIcon
        },
        {
            name: "Customers",
            to: "/admin/customers",
            icon: CustomersIcon
        },
        {
            name: "Products",
            to: "/admin/products",
            icon: ProductsIcon
        },
        {
            name: "Orders",
            to: "/admin/orders",
            icon: OrdersIcon
        },
        {
            name: "Reviews",
            to: "/admin/reviews",
            icon: ReviewsIcon
        },
        {
            name: "Settings",
            to: "/admin/settings",
            icon: SettingsIcon
        },
    ]

    
    return (
        <Sidebar>
            <SidebarHeader className="h-16 border-b border-border flex flex-row items-center">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Admin Dashboard
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainLinks.map((link) => (
                                <SidebarMenuItem key={link.name}>
                                    <SidebarMenuButton asChild className={cn("flex items-center rounded-xs", location.pathname === link.to ? "bg-muted" : "")}>
                                        <Link to={link.to}>
                                            <link.icon className="mr-2 h-4 w-4" />
                                            {link.name}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border h-16">
                <SidebarGroup className="flex flex-row items-center gap-2">
                    <UserButton />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            {account?.firstName} {account?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {account?.email}
                        </span>
                    </div>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar