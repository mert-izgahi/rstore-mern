import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import { useGetMyAccount } from "@/hooks/auth/use-get-my-account";
import { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const Page = () => {
    const { data: account, isLoading, error, getMyAccount } = useGetMyAccount();
    const orders = useMemo(() => {
        return account?.orders
    }, [account])

    useEffect(() => {
        getMyAccount()
    }, [getMyAccount])

    if (error) {
        return <ErrorState error={error} />
    }

    if (isLoading) {
        return <LoadingState />
    }


    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        List of orders in the store
                    </p>
                </div>
            </div>


            <Card className="w-full rounded-xs">
                <CardContent className="flex flex-col">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Order Status</TableHead>
                                <TableHead>Order Total</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                orders?.map((order, index) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{dayjs(order.createdAt).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{formatCurrency(order.total)}</TableCell>
                                        <TableCell>
                                            <Button asChild variant={"ghost"} size={"icon"}>
                                                <Link to={`/account/orders/${order._id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}

export { Page as AccountOrdersPage }