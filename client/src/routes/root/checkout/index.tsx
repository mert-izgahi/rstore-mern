import CheckoutForm from "@/components/forms/checkout-form";

const Page = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground text-sm">
                Complete your order by filling out the form below
            </p>
            <CheckoutForm />
        </div>
    )
}

export { Page as RootCheckoutPage }