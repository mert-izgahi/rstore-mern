import { resetPasswordSchema, ResetPasswordInput } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../shared/submit-button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { toast } from "sonner"
import { useResetPassword } from "@/hooks/auth/use-reset-password"


interface ForgotPasswordFormProps {
    passwordResetToken: string
}

function ResetPasswordForm({ passwordResetToken }: ForgotPasswordFormProps) {
    const { isPending, error, resetPassword } = useResetPassword()

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    const handleSubmit = async (data: ResetPasswordInput) => {
        await resetPassword(data, passwordResetToken).then(() => {
            toast.success("Password reset successfully")
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Password must be at least 6 characters
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Confirm Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <SubmitButton text="Reset Password" loading={isPending} />
            </form>
        </Form>
    )
}

export default ResetPasswordForm