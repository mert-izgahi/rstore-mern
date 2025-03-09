import AccountForm from "@/components/forms/account-form"
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/use-auth-store"


const Page = () => {
    const { account } = useAuthStore();
    return (
        <Card className="w-full rounded-xs">
            <CardContent>
                <AccountForm account={account!} />
            </CardContent>
        </Card>
    )
}

export { Page as AccountSettingsPage }