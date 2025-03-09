import ResetPasswordForm from "@/components/forms/reset-password-form"
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom"

const Page = () => {
    const [searchParams] = useSearchParams();

    const token = useMemo(() => searchParams.get("token"), [searchParams]);


    if (!token) {
        return (
            <div className="flex flex-col space-y-6">
                <p className="text-center text-muted-foreground text-sm">
                    Invalid token
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-6">
            <ResetPasswordForm passwordResetToken={token!} />

            <p className="text-center text-muted-foreground text-sm">
                Don&apos;t have an account? <Button asChild variant={"link"}><Link to="/auth/sign-up">Sign Up</Link></Button>
            </p>

            <p className="text-center text-muted-foreground text-sm">
                <Button asChild variant={"link"}><Link to="/auth/sign-in">Sign In</Link></Button>
            </p>
        </div>
    )
}

export { Page as AuthResetPasswordPage }