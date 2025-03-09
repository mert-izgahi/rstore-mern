import { IOrder } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import dayjs from "dayjs"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"
import { PaymentMethod, PaymentStatus } from "@/lib/enums"
interface IOrderDetailsProps {
    order: IOrder
}
function OrderDetails({ order }: IOrderDetailsProps) {
    const paymentStatus = useMemo(() => {
        if (order.paymentStatus === PaymentStatus.PAID) {
            return "Paid"
        }
        if (order.paymentStatus === PaymentStatus.PENDING) {
            return "Pending"
        }
        return "Unpaid"
    }, [order])

    const paymentMethod = useMemo(() => {
        if (order.paymentMethod === PaymentMethod.CART) {
            return "Cart"
        }
        if (order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            return "Cash on Delivery"
        }
        return "Unknown"
    }, [order])
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
                <Card className="rounded-xs">
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover" />
                                        </TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{formatCurrency(item.price)}</TableCell>
                                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}

                                <TableRow>
                                    <TableCell colSpan={5} className="font-bold">
                                        Total
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {formatCurrency(order.total)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="rounded-xs">
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">
                        <p className="font-medium text-md">{order.shippingAddress.address}</p>
                        <p className="font-medium text-md">{order.shippingAddress.city}</p>
                        <p className="font-medium text-md">{order.shippingAddress.state}</p>
                        <p className="font-medium text-md">{order.shippingAddress.zipCode}</p>
                        <p className="font-medium text-md">{order.shippingAddress.country}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 col-span-1">


                <Card className="rounded-xs">
                    <CardHeader>
                        <CardTitle>Payments</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">
                        <div className="flex w-full items-center justify-between">
                            <p className="font-medium text-md">Payment Method</p>
                            <p className="font-medium text-md">{paymentMethod}</p>
                        </div>

                        <div className="flex w-full items-center justify-between">
                            <p className="font-medium text-md">Payment Status</p>
                            <p className="font-medium text-md">{paymentStatus}</p>
                        </div>

                        <div className="flex w-full items-center justify-between">
                            <p className="font-medium text-md">Payment Id</p>
                            <p className="font-medium text-md">{order.paymentId || "-"}</p>
                        </div>

                        <div className="flex w-full items-center justify-between">
                            <p className="font-medium text-md">Total</p>
                            <p className="font-medium text-md">{formatCurrency(order.total)}</p>
                        </div>

                        {
                            order.paymentStatus === PaymentStatus.PAID && <div className="flex w-full items-center justify-between">
                                <p className="font-medium text-md">Paid At</p>
                                <p className="font-medium text-md">{dayjs(order.paidAt).format("DD/MM/YYYY")}</p>
                            </div>
                        }




                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default OrderDetails