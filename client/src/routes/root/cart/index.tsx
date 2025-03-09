import { useCartStore } from "@/store/use-cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/use-auth-store";
const Page = () => {
    const { items, calculateTotal, removeProduct, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Cart</h1>
                <p className="text-muted-foreground text-sm">
                    View and manage your cart here
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-4 col-span-1 md:col-span-3">
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
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover" />
                                            </TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatCurrency(item.price)}</TableCell>
                                            <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>

                                            <TableCell >
                                                <div className="flex flex-row gap-2">
                                                    <Button size={"icon"} variant={"ghost"} onClick={() => removeProduct(item.productId)}>
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell colSpan={5} className="font-bold">
                                            Total
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {formatCurrency(calculateTotal())}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-xs">
                    <CardContent className="flex flex-col gap-4">
                        {
                            isAuthenticated && <Button asChild>
                                <Link to="/checkout">Checkout</Link>
                            </Button>
                        }

                        {
                            !isAuthenticated &&
                            <Button asChild>
                                <Link to="/auth/sign-in">Sign In</Link>
                            </Button>
                        }

                        <Button type="button" variant={"ghost"} onClick={clearCart}>Clear Cart</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export { Page as RootCartPage }