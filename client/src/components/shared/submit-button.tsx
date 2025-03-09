import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
interface SubmitButtonProps {
    text: string
    className?: string
    loading?: boolean
}
function SubmitButton({ text, className, loading }: SubmitButtonProps) {
    return (
        <Button className={cn("min-w-32", className)} type="submit">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {text}
        </Button>
    )
}

export default SubmitButton