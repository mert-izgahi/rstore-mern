import ProductCardsList from "@/components/shared/product-cards-list";
import { useGetTopRatedProducts } from "@/hooks/products/use-get-top-rated-products"
import { useEffect } from "react";

const Page = () => {
    const { isLoading, error, data, getTopRatedProducts } = useGetTopRatedProducts();
    useEffect(() => {
        getTopRatedProducts("")
    }, [])
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Our Top Rated Products</h1>
            <p className="text-muted-foreground text-sm">
                Check out our top rated products, we are sure you will love them!
            </p>

            <ProductCardsList products={data} loading={isLoading} error={error} />
        </div>
    )
}

export { Page as RootHomePage }