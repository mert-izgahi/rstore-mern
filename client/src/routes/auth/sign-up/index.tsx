import SignUpForm from "@/components/forms/sign-up-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Page = () => {
    return (
        <div className="flex flex-col space-y-6">
            <SignUpForm />

            <p className="text-center text-muted-foreground text-sm">
                Already have an account? <Button asChild variant={"link"}><Link to="/auth/sign-in">Sign In</Link></Button>
            </p>

            <p className="text-center text-muted-foreground text-sm">
                <Button asChild variant={"link"}><Link to="/auth/forgot-password">Forgot Password</Link></Button>
            </p>
        </div>
    )
}

export { Page as AuthSignUpPage }