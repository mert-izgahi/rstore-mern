import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface IProps {
    open: boolean;
    isPending?: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
}

function AlertModal({ open, title, description, isPending, onClose, onConfirm }: IProps) {
    const handleClose = () => {
        if (open) {
            onClose();
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button onClick={handleClose} variant={"ghost"}>Cancel</Button>
                    <Button onClick={onConfirm} variant={"destructive"} disabled={isPending}>
                        {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertModal