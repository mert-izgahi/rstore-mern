import ProductForm from "@/components/forms/product-form"
import Container from "@/components/shared/container"
import ErrorState from "@/components/shared/error-state"
import LoadingState from "@/components/shared/loading-state"
import { Button } from "@/components/ui/button"
import { useGetProduct } from "@/hooks/products/use-get-product"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"


const Page = () => {
    const { id } = useParams();
    const { data, isLoading, error, getProduct } = useGetProduct()

    useEffect(() => {
        getProduct(id!)
    }, [id])

    if (isLoading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState error={error} />
    }

    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Update Product</h1>
                    <p className="text-muted-foreground">
                        Update an existing product
                    </p>
                </div>

                <div className="ms-auto">
                    <Button asChild variant={"link"}>
                        <Link to="/admin/products">Back</Link>
                    </Button>
                </div>
            </div>

            {
                data && <ProductForm mode="update" product={data!} />
            }
        </Container>
    )
}



export { Page as AdminEditProductPage }