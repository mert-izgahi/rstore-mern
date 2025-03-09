import Pagination from "@/components/shared/pagination";
import ProductCardsList from "@/components/shared/product-cards-list";
import SearchInput from "@/components/shared/search-input";
import { useGetProducts } from "@/hooks/products/use-get-products"
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from "@/lib/enums";
const Page = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { data, isLoading, error, getProducts } = useGetProducts();

    const query = useMemo(() => searchParams.toString() || "", [searchParams]);
    useEffect(() => {
        getProducts(query)
    }, [query])



    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground text-sm">
                List of products in the store, you can filter them by category
            </p>

            <div className="flex flex-row justify-between">
                <SearchInput />

                <div className="flex items-center gap-4">
                    <Select value={searchParams.get('category') || ''}
                        onValueChange={(value) => {
                            if (value === "all") searchParams.delete('category')
                            else {
                                searchParams.set('category', value)
                                searchParams.delete('page')
                            }

                            setSearchParams(searchParams)
                        }}
                    >
                        <SelectTrigger className="rounded-xs w-48">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {
                                    Object.values(Category).map((category) => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ProductCardsList products={data.records} loading={isLoading} error={error} />


            <Pagination hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage} />
        </div>
    )
}

export { Page as RootProductsListPage }