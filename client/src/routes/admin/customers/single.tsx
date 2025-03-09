import Container from "@/components/shared/container"
import ErrorState from "@/components/shared/error-state"
import LoadingState from "@/components/shared/loading-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useGetAccount } from "@/hooks/accounts/use-get-account"
import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountForm from "@/components/forms/account-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUpdateAccount } from "@/hooks/accounts/use-update-account"

dayjs.extend(relativeTime)
const Page = () => {
    const { id } = useParams();
    const { getAccount, data, isLoading, error } = useGetAccount();

    const { isBlockPending, toggleBlock, isDeletePending, toggleDelete } = useUpdateAccount();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        getAccount(id!);
    }, [id])

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState error={error} />

    return (
        <Container className="flex flex-col gap-12">
            <Card className="rounded-xs">
                <CardContent className="flex flex-row items-center gap-6">
                    <Avatar className="w-24 h-24 ">
                        <AvatarImage src={data?.imageUrl} className="object-cover" />
                        <AvatarFallback>{data?.firstName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-row items-center gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-bold">{data?.firstName} {data?.lastName}</h1>
                                <div className="flex items-center gap-2">
                                    {data?.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                                    {data?.isVerified && <Badge variant="success">Verified</Badge>}
                                    {data?.isDeleted && <Badge variant="destructive">Deleted</Badge>}
                                    {
                                        !data?.isBlocked && !data?.isDeleted && <Badge variant="success">Active</Badge>
                                    }

                                    <p className="text-sm text-muted-foreground">
                                        Last Order : {dayjs(data?.lastOrderAt).format("DD/MM/YYYY")}
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
                            <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                <p className="text-muted-foreground">{data?.email}</p>
                            </div>

                            <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4" />
                                <p className="text-muted-foreground text-sm">{data?.phoneNumber || "Not Available"}</p>
                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row gap-4 w-full">
                <Card className="w-full md:w-1/3 rounded-xs">
                    <CardContent className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Orders</h1>
                        <h4>{data?.ordersCount}</h4>
                        <small className="text-muted-foreground">Total Orders Placed</small>
                    </CardContent>
                </Card>

                <Card className="w-full md:w-1/3 rounded-xs">
                    <CardContent className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Total Spent</h1>
                        <h4>{formatCurrency(data?.totalSpent || 0)}</h4>
                        <small className="text-muted-foreground">Lifetime value</small>
                    </CardContent>
                </Card>

                <Card className="w-full md:w-1/3 rounded-xs">
                    <CardContent className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Last Order</h1>
                        <h4>{dayjs(data?.lastOrderAt).format("DD/MM/YYYY")}</h4>
                        <small className="text-muted-foreground">
                            {dayjs(data?.lastOrderAt).fromNow()}
                        </small>
                    </CardContent>
                </Card>
            </div>


            <div>
                <Tabs defaultValue={searchParams.get("tab") || "orders"}>
                    <TabsList className="rounded-xs flex-col md:flex-row w-full md:w-auto h-auto md:h-12">
                        <TabsTrigger value="orders" onClick={() => {
                            setSearchParams({ tab: "orders" })
                        }} className="rounded-xs cursor-pointer w-full md:min-w-32 ">Orders</TabsTrigger>
                        <TabsTrigger value="edit"
                            onClick={() => {
                                setSearchParams({ tab: "edit" })
                            }}
                            className="rounded-xs cursor-pointer w-full md:min-w-32">Edit</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                        Orders Table
                    </TabsContent>
                    <TabsContent value="edit" className="flex flex-col gap-4">
                        <div className="border border-border rounded-xs flex flex-col gap-4 p-6">
                            <AccountForm account={data!} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-border p-6">
                            <div className="flex items-start">
                                <Checkbox disabled={isBlockPending} id="blocked" checked={data?.isBlocked} onCheckedChange={
                                    async () => {
                                        await toggleBlock(data!._id)
                                    }
                                } className="mt-1" />
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm cursor-pointer ml-2" htmlFor="blocked">Block Account</Label>
                                    {
                                        data?.isBlocked &&
                                        <p className="text-xs text-destructive ml-2">Account will not be able to login</p>
                                    }
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Checkbox disabled={isDeletePending} id="delete" checked={data?.isDeleted} onCheckedChange={
                                    async () => {
                                        await toggleDelete(data!._id)
                                    }
                                } className="mt-1" />
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm cursor-pointer ml-2" htmlFor="delete">Delete Account</Label>
                                    {
                                        data?.isDeleted &&
                                        <p className="text-xs text-destructive ml-2">Account will be permanently deleted</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Container>
    )
}

export { Page as AdminSingleCustomerPage }