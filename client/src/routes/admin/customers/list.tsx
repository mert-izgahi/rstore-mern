import Container from "@/components/shared/container"
import CustomersTable from "@/components/tables/customers-table"



const Page = () => {
    
    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <p className="text-muted-foreground">
                        List of customers in the store
                    </p>
                </div>

            </div>

            <div>
                <CustomersTable />
            </div>
        </Container>
    )
}

export { Page as AdminProductsListPage }

export { Page as AdminCustomersListPage }