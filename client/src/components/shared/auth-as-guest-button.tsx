import { useAuthAsGuest } from '@/hooks/auth/use-auth-as-guest'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function AuthAsGuestButton() {
    const { authAsGuest, isPending } = useAuthAsGuest();

    const handleClick = async() => {
        await authAsGuest();
        toast.success("Account logged in successfully");
    }
    return (
        <Button type='button' className='w-full' variant={"outline"} onClick={handleClick} disabled={isPending}>
            {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
            Auth as Guest
        </Button>
    )
}

export default AuthAsGuestButton