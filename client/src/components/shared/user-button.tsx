import { useAuthStore } from "@/store/use-auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useMemo } from "react";
import { Heart, Settings2, ShoppingBag, ArrowLeftSquare, Loader2, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useSignOut } from "@/hooks/auth/use-sign-out";

function UserButton() {
    const { account } = useAuthStore();
    const { isPending, signOut } = useSignOut();
    const fallback = useMemo(() => {
        if (account) {
            return account?.firstName[0]
        }
    }, [account])
    const role = useMemo(() => {
        if (account) {
            return account?.role
        }
    }, [account])

    const links = [
        {
            name: "Orders",
            to: "/account/orders",
            icon: <ShoppingBag className="w-4 h-4" />
        },
        {
            name: "Wishlist",
            to: "/account/wishlist",
            icon: <Heart className="w-4 h-4" />
        },
        {
            name: "Settings",
            to: "/account/settings",
            icon: <Settings2 className="w-4 h-4" />
        }
    ]


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={account?.imageUrl} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={5} className="w-56">
                <DropdownMenuLabel className="text-xs">My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {links.map((link) => (
                    <DropdownMenuItem key={link.name} asChild className="cursor-pointer rounded-xs">
                        <Link to={link.to} className="flex items-center gap-2">
                            {link.icon}
                            {link.name}
                        </Link>
                    </DropdownMenuItem>
                ))}
                {
                    (role === "admin" || role === "guest") && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer rounded-xs">
                                <Link to="/admin/overview" className="flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Admin
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => await signOut()} className="cursor-pointer rounded-xs">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowLeftSquare className="mr-2 h-4 w-4" />}
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton