import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Bell as NotificationsIcon, AlarmCheck as CheckIcon } from "lucide-react";

function NotificationMenuItem() {
    return <DropdownMenuItem className="flex justify-between cursor-pointer">
        <CheckIcon className="mr-2 h-4 w-4" />
        <div className="flex flex-col space-y-1 leading-none flex-1">
            <p className="font-medium leading-none">You have a new message</p>
            <p className="text-xs leading-none text-muted-foreground">
                2 minutes ago
            </p>
        </div>
    </DropdownMenuItem>
}

function NotificationsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <NotificationsIcon className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
                <div className="h-12 flex items-center p-4">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                </div>
                <NotificationMenuItem />
                <NotificationMenuItem />
                <NotificationMenuItem />
                <NotificationMenuItem />
                <NotificationMenuItem />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationsMenu