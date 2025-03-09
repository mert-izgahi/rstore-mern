import { useAuthStore } from '@/store/use-auth-store';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../shared/submit-button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { orderSchema, OrderInput } from '@/lib/zod';
import { useCartStore } from '@/store/use-cart-store';
import { useCreateOrder } from '@/hooks/orders/use-create-order';
import { toast } from 'sonner';
import { PaymentMethod } from '@/lib/enums';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { stripePromise } from '@/lib/stripe';
import { useCreateStripeSession } from '@/hooks/orders/use-create-stripe-session';
function CheckoutForm() {
    const { account } = useAuthStore();
    const { items, calculateTotal } = useCartStore();
    const { isPending, error, createOrder } = useCreateOrder();
    const { isPending: isStripePending, createStripeSession } = useCreateStripeSession();
    const form = useForm<OrderInput>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            items: items || [],
            shippingAddress: {
                firstName: account?.firstName || "",
                lastName: account?.lastName || "",
                address: "",
                state: "",
                city: "",
                country: "",
                zipCode: ""
            },
            paymentMethod: PaymentMethod.CART,
            total: calculateTotal() || 0
        },
    })
    console.log(form.formState.errors);

    const onSubmit = async (data: OrderInput) => {
        const newOrder = await createOrder(data);
        const stripe = await stripePromise;
        const sessionId = await createStripeSession(newOrder._id);
        const result = await stripe?.redirectToCheckout({
            sessionId
        })

        if (result?.error) {
            toast.error(result.error.message);
        }

        toast.success("Order created successfully");
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {
                    error && <Alert variant={"destructive"} className="rounded-sm">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                }
                <FormField
                    control={form.control}
                    name="shippingAddress.firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shippingAddress.lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shippingAddress.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shippingAddress.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shippingAddress.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shippingAddress.zipCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <FormControl>
                                <RadioGroup defaultValue={field.value} onValueChange={field.onChange}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={PaymentMethod.CART} id="cart" />
                                        <label htmlFor="cart">Cart</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={PaymentMethod.CASH_ON_DELIVERY} id="cod" />
                                        <label htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={PaymentMethod.PAYPAL} id="paypal" />
                                        <label htmlFor="paypal">PayPal</label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <SubmitButton text='Place Order' loading={isPending || isStripePending} />
            </form>
        </Form>
    )
}

export default CheckoutForm