import { cn } from '@/lib/utils'
import React from 'react'
import { Button } from '../ui/button'
import { Sidebar, X } from 'lucide-react'

interface MobileSidebarTriggerProps {
    onClick?: () => void
    className?: string
}
export const MobileSidebarTrigger = ({ onClick, className }: MobileSidebarTriggerProps) => {
    return <Button size={"icon"} variant={"ghost"} onClick={onClick} className={cn("", className)}>
        <Sidebar className="w-4 h-4" />
    </Button>
}

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

function MobileSidebar({ children, isOpen, onClose }: MobileSidebarProps) {
    return (
        <div onClick={onClose} className={cn("fixed inset-0 top-0 right-0 left-0  border-0 bg-transparent z-50  overflow-y-auto md:hidden duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className={cn("absolute bg-background border-l border-border w-[70%] h-full top-0 right-0 flex flex-col")}>
                <div className="h-16 flex items-center justify-end px-4 border-b border-border">
                    <Button size={"icon"} variant={"ghost"} onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto flex flex-col gap-4 p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MobileSidebar
