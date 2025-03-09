import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../shared/submit-button"
import { useForgotPassword } from "@/hooks/auth/use-forgot-password"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { toast } from "sonner"



function ForgotPasswordForm() {
    const { isPending, error, forgotPassword } = useForgotPassword()
    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleSubmit = async (data: ForgotPasswordInput) => {
        await forgotPassword(data).then(() => {
            toast.success("Password reset email sent successfully")
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {
                    error && <Alert variant={"destructive"} className="rounded-sm">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                }
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your email address
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <SubmitButton text="Reset Password" loading={isPending} />
            </form>
        </Form>
    )
}

export default ForgotPasswordForm