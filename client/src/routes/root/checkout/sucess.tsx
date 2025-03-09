import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import { useStripeSuccessCallback } from "@/hooks/orders/use-stripe-sucess-callback"
import { useEffect, useMemo } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const Page = () => {
    const { checkPaymentStatus, isLoading, error, isPaid } = useStripeSuccessCallback();
    const [searchParams] = useSearchParams();
    
    const session_id = useMemo(() => {
        return searchParams.get("session_id")
    }, [searchParams])

    useEffect(() => {
        if (!session_id) return;
        checkPaymentStatus(session_id)
    }, [checkPaymentStatus, session_id])

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState error={error} />

    if (isPaid) return <Navigate to="/account/orders" />

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Checkout Success</h1>
            <p className="text-muted-foreground text-sm">
                Please be patient while we process your order
            </p>
            {session_id}

            <p className="text-muted-foreground text-sm">
                You can close this window now
            </p>
        </div>
    )
}

export { Page as RootSuccessCheckoutPage }