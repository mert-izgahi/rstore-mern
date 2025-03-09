import SignInForm from "@/components/forms/sign-in-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Page = () => {
    return (
        <div className="flex flex-col space-y-6">
            <SignInForm />

            <p className="text-center text-muted-foreground text-sm">
                Don&apos;t have an account? <Button asChild variant={"link"}><Link to="/auth/sign-up">Sign Up</Link></Button>
            </p>

            <p className="text-center text-muted-foreground text-sm">
                <Button asChild variant={"link"}><Link to="/auth/forgot-password">Forgot Password</Link></Button>
            </p>
        </div>
    )
}

export { Page as AuthSignInPage }