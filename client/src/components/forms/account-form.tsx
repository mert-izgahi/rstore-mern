import { accountSchema, AccountInput } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../shared/submit-button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { IAccount } from "@/lib/types"
import AvatarInput from "../shared/avatar-input"
import { useUpdateAccount } from "@/hooks/accounts/use-update-account"

interface AccountFormProps {
    account: IAccount
}
function AccountForm({ account }: AccountFormProps) {
    const { isPending, error, updateAccount } = useUpdateAccount();
    const form = useForm<AccountInput>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            firstName: account?.firstName || "",
            lastName: account?.lastName || "",
            phoneNumber: account?.phoneNumber || "",
            imageUrl: account?.imageUrl || "",
        },
    })

    const handleSubmit = async (data: AccountInput) => {
        await updateAccount(account?._id as string, data);
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
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AvatarInput value={field.value!} onChange={field.onChange} />
                            </FormControl>
                            <FormDescription>
                                Upload profile image
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="flex-1 w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your first name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="flex-1 w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your last name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your phone number
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <SubmitButton text="Save Changes" loading={isPending} />
            </form>
        </Form>
    )
}

export default AccountForm