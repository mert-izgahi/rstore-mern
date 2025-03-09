import Container from "@/components/shared/container"
import OrdersTable from "@/components/tables/orders-table"

const Page = () => {
    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        List of orders in the store
                    </p>
                </div>
            </div>

            <div>
                <OrdersTable />
            </div>
        </Container>
    )
}

export { Page as AdminOrdersListPage }