import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
}


function Modal({  title, description, children, className, isOpen, onClose }: IProps) {
    const handleClose = () => {
        if(isOpen) {
            onClose();
        }
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={cn("w-96", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Modal