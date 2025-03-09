import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import { useGetProduct } from "@/hooks/products/use-get-product";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/use-cart-store";

const Page = () => {
    const { id } = useParams();
    const { getProduct, data, isLoading, error } = useGetProduct();
    const [quantity, setQuantity] = useState(1);
    const { addProduct } = useCartStore();
    useEffect(() => {
        getProduct(id!)
    }, [id])

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState error={error} />
    if (!data) return <Navigate to={"/"} />
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-8 col-span-1 md:col-span-2">
                <Carousel className="">
                    <CarouselContent className="h-96">
                        {data?.images.map((image, i) => (
                            <CarouselItem key={i} className="min-w-0 basis-full md:basis-1/2">
                                <img src={image} alt={data?.name} className="w-full h-full object-cover" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2" />
                    <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2" />
                </Carousel>

                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">{data?.name}</h1>
                    <p className="text-muted-foreground">
                        {data?.description}
                    </p>
                </div>

                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">Properties</h1>
                    <ul className="list-disc list-inside flex flex-col space-y-2">
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Price:</span>
                            <span className="font-semibold">{data && formatCurrency(data?.price)}</span>
                        </li>
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Category</span>
                            <span className="font-semibold">{data?.category}</span>
                        </li>
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Weight (kg):</span>
                            <span className="font-semibold">{data?.weight}</span>
                        </li>
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Dimensions (W x H x L) (cm):</span>
                            <span className="font-semibold">{data?.dimensions?.width} x {data?.dimensions?.height} x {data?.dimensions?.length}</span>
                        </li>
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Rating:</span>
                            <span className="font-semibold">{data?.rating}</span>
                        </li>
                        <li className="flex items-center justify-between border border-border p-4 rounded-xs">
                            <span className="font-semibold">Reviews Count:</span>
                            <span className="font-semibold">{data?.numReviews}</span>
                        </li>

                    </ul>
                </div>

                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">Reviews</h1>
                    <p className="text-muted-foreground">
                        List of reviews in the store
                    </p>

                    <div className="flex flex-col space-y-4">
                        {
                            data && data.reviews.map((review, i) => (
                                <div key={i} className="flex flex-col space-y-2 border border-border p-4 rounded-xs">
                                    <div className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={review.account.imageUrl} />
                                            <AvatarFallback>{review.account.firstName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="font-medium leading-none">{review.account.firstName} {review.account.lastName}</p>
                                            <p className="text-sm text-muted-foreground">{review.account.email}</p>
                                        </div>
                                        <div className="ms-auto">
                                            <div className="flex items-center gap-2">
                                                {review.rating}
                                                <Star className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-8">
                <Card className="rounded-xs">
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <p>{data?.name}</p>
                            <p>
                                {formatCurrency(data?.price)}
                            </p>
                        </div>
                        <small>Available: {data?.quantity}</small>
                        <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} min={1} max={data?.quantity} />
                        <Button type="button"
                            onClick={() => {
                                if (data) {
                                    addProduct(data, quantity)
                                }
                            }}
                        >Add to Cart</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export { Page as RootSingleProductPage }