import Container from "@/components/shared/container";
import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetOrder } from "@/hooks/orders/use-get-order";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import OrderDetails from "@/components/shared/order-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/lib/enums";
import { useUpdateOrderStatus } from "@/hooks/orders/use-update-order-status";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const Page = () => {
    const { id } = useParams();
    const { data, error, isLoading, getOrder } = useGetOrder();
    const { updateOrderStatus, error: updateError } = useUpdateOrderStatus();


    useEffect(() => {
        getOrder(id!)
    }, [id])

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState error={error} />

    return (
        <Container className="flex flex-col gap-8">
            <Card className="rounded-xs">
                <CardContent className="flex flex-row items-start justify-between">
                    <div className="flex flex-col space-y-3">
                        <h1 className="text-xl font-bold">Order - {data?._id}</h1>
                        <div className="flex flex-row space-x-4">
                            <Badge>
                                {data?.status}
                            </Badge>

                            <small>
                                {dayjs(data?.createdAt).format("DD/MM/YYYY")}
                            </small>
                        </div>
                    </div>
                    <div className="ms-auto">
                        <Button asChild variant="link">
                            <Link to="/admin/orders">Back</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xs">
                <CardHeader>
                    <CardTitle>Customer</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-row items-center gap-3">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={data?.account?.imageUrl} className="object-cover" />
                        <AvatarFallback>{data?.account?.firstName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-semibold text-sm">{data?.account?.firstName} {data?.account?.lastName}</span>
                            <span className="text-muted-foreground text-xs">{data?.account?.email}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-semibold text-sm">{data?.account?.phoneNumber}</span>
                        </div>
                    </div>

                    <div className="ms-auto">
                        <Button asChild variant="link">
                            <Link to={`/admin/customers/${data?.account?._id}`}>View Customer</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xs">
                <CardContent className="flex flex-col gap-2">
                    {
                        updateError && <Alert>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{updateError}</AlertDescription>
                        </Alert>
                    }
                    <div className="flex flex-row items-center justify-between gap-3">
                        <Badge className={cn("", {
                            "bg-green-500": data?.status === OrderStatus.COMPLETED,
                            "bg-yellow-500": data?.status === OrderStatus.SHIPPED,
                            "bg-red-500": data?.status === OrderStatus.CANCELLED
                        })}>
                            {data?.status}
                        </Badge>
                        <Select value={data?.status} onValueChange={async (e) => {
                            await updateOrderStatus(data?._id as string, e)
                        }}>
                            <SelectTrigger className="w-[180px] rounded-xs ">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                                <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {data && <OrderDetails order={data!} />}
        </Container>
    )
}

export { Page as AdminSingleOrderPage }