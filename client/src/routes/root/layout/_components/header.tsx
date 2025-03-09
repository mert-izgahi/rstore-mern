import Container from "@/components/shared/container"
import Logo from "@/components/shared/logo"
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom"
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import { useState } from "react";
import MobileSidebar, { MobileSidebarTrigger } from "@/components/shared/mobile-sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import UserButton from "@/components/shared/user-button";
function Header() {
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const links = [
        {
            name: "Home",
            to: "/"
        },
        {
            name: "Products",
            to: "/products"
        }
    ]
    return (
        <div className="h-16 border-b border-border mb-12">
            <Container className="h-full flex items-center gap-6 justify-between">
                <Logo />
                <div className="hidden md:flex flex-1">
                    {/* NAVBAR LINKS */}
                    <ul className="flex items-center gap-6">
                        {links.map((link) => (
                            <li key={link.name} className={cn("text-sm font-medium hover:underline", location.pathname === link.to ? "underline" : "")}>
                                <Link to={link.to}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* NAVBAR ACTIONS */}
                    <div className="flex items-center gap-4 ms-auto">
                        <Button asChild size={"icon"} variant={"ghost"}>
                            <Link to="/cart">
                                <ShoppingBag className="w-4 h-4" />
                            </Link>
                        </Button>
                        <ThemeToggler />
                        {
                            isAuthenticated ? <UserButton /> : <Button asChild>
                                <Link to="/auth/sign-in">Sign In</Link>
                            </Button>
                        }
                    </div>
                </div>

                {/* Mobile Drawer */}
                <div className="md:hidden ms-auto flex items-center gap-4">
                    <ThemeToggler />
                    {isAuthenticated && <UserButton />}
                    <MobileSidebarTrigger onClick={() => setIsOpen(!isOpen)} />
                    <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
                        {links.map((link) => (
                            <Link to={link.to} key={link.name} className="text-sm font-medium hover:underline">
                                {link.name}
                            </Link>
                        ))}

                        <Link to={"/cart"} className="text-sm font-medium hover:underline">
                            Cart
                        </Link>

                        {
                            !isAuthenticated && <Button asChild className="mt-12">
                                <Link to="/auth/sign-in">Sign In</Link>
                            </Button>
                        }
                    </MobileSidebar>
                </div>


            </Container>
        </div>
    )
}

export default Header