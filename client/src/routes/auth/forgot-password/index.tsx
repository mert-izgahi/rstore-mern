import ForgotPasswordForm from "@/components/forms/forgot-password-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Page = () => {
    return (
        <div className="flex flex-col space-y-6">
            <ForgotPasswordForm />

            <p className="text-center text-muted-foreground text-sm">
                Already have an account? <Button asChild variant={"link"}><Link to="/auth/sign-in">Sign In</Link></Button>
            </p>

            <p className="text-center text-muted-foreground text-sm">
                <Button asChild variant={"link"}><Link to="/auth/sign-up">Sign Up</Link></Button>
            </p>
        </div>
    )
}

export { Page as AuthForgotPasswordPage }