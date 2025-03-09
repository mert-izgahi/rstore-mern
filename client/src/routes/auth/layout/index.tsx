import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store"
import { Navigate, Outlet } from "react-router-dom"

const Layout = () => {
    const { isAuthenticated, account } = useAuthStore();

    if (isAuthenticated && account) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <div className="relative flex h-[300px] mb-12 w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20">
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                    )}
                />
                <div className="flex flex-col items-center justify-center text-center text-foreground space-y-4">
                    <h1 className="text-5xl font-bold ">RStore</h1>
                    <p>Where you can find the best products</p>
                </div>
            </div>
            <Card className="max-w-md mx-auto border border-border p-6 rounded-xs shadow-none">
                <CardHeader className="border-b border-border pb-6">
                    <CardTitle>RStore Authentication</CardTitle>
                    <CardDescription>
                        Please Provide Your Credentials
                    </CardDescription>
                </CardHeader>
                <div className="p-6">
                    <Outlet />
                </div>
            </Card>
        </div>
    )
}

export { Layout as AuthLayout }