import Container from "@/components/shared/container"
import ProductsTable from "../../../components/tables/products-table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"



const Page = () => {
    
    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">
                        List of products in the store
                    </p>
                </div>

                <div className="ms-auto">
                    <Button asChild>
                        <Link to="/admin/products/create">Create Product</Link>
                    </Button>
                </div>
            </div>

            <div>
                <ProductsTable />
            </div>
        </Container>
    )
}

export { Page as AdminProductsListPage }