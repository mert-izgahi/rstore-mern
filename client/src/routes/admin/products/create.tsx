import Container from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import ProductForm from "../../../components/forms/product-form"

const Page = () => {
    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Create Product</h1>
                    <p className="text-muted-foreground">
                        Create a new product
                    </p>
                </div>

                <div className="ms-auto">
                    <Button asChild variant={"link"}>
                        <Link to="/admin/products">Back</Link>
                    </Button>
                </div>
            </div>

            <ProductForm mode="create" />
        </Container>
    )
}

export { Page as AdminCreateProductPage }