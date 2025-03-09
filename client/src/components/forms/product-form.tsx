import { productSchema, ProductInput } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../shared/submit-button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Category, ProductStatus } from "@/lib/enums"
import { Separator } from "../ui/separator"
import ImageInput from "../shared/image-input"
import { IProduct } from "@/lib/types"
import { useCreateProduct } from "@/hooks/products/use-create-product"
import { useUpdateProduct } from "@/hooks/products/use-update-product"

interface IProductFormProps {
    mode: "create" | "update"
    product?: IProduct
}

function ProductForm({ mode, product }: IProductFormProps) {
    const { createProduct, isPending: createPending, error: createError } = useCreateProduct();
    const { updateProduct, isPending: updatePending, error: updateError } = useUpdateProduct();
    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price || 0,
            quantity: product?.quantity || 0,
            images: product?.images || [],
            category: product?.category || "",
            status: product?.status || "",
            weight: product?.weight || 0,
            featured: product?.featured || false,
            dimensions: {
                length: product?.dimensions.length || 0,
                width: product?.dimensions.width || 0,
                height: product?.dimensions.height || 0,
            }
        },
    })

    const handleSubmit = async (data: ProductInput) => {
        if (mode === "create") {
            await createProduct(data);
        }

        if (mode === "update") {
            await updateProduct(product?._id as string, data);
        }

        form.reset();
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-12">
                {
                    createError && <Alert variant={"destructive"} className="rounded-sm">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{createError}</AlertDescription>
                    </Alert>
                }

                {
                    updateError && <Alert variant={"destructive"} className="rounded-sm">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{updateError}</AlertDescription>
                    </Alert>
                }

                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Basic Information</h1>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name of the product" {...field} />
                                </FormControl>
                                <FormDescription>Name of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} className="resize-none" placeholder="Description of the product" {...field} />
                                </FormControl>
                                <FormDescription>Description of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="Price of the product" type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormDescription>Price of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Advanced Information</h1>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {
                                                Object.entries(Category).map(([key, value]) => (
                                                    <SelectItem key={key} value={value}>
                                                        {value}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>Category of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value={ProductStatus.IN_STOCK}>In Stock</SelectItem>
                                            <SelectItem value={ProductStatus.LOW_STOCK}>Low Stock</SelectItem>
                                            <SelectItem value={ProductStatus.OUT_OF_STOCK}>Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>Category of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />



                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Inventory</h1>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input placeholder="Quantity of the product" type="number"
                                        value={field.value} onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Quantity of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                    <Input placeholder="Weight of the product" type="number"
                                        value={field.value} onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Weight of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dimensions.height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height</FormLabel>
                                <FormControl>
                                    <Input placeholder="Height of the product" type="number"
                                        value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormDescription>Height of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dimensions.width"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Width</FormLabel>
                                <FormControl>
                                    <Input placeholder="Width of the product" type="number" 
                                    value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormDescription>Width of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dimensions.length"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length</FormLabel>
                                <FormControl>
                                    <Input placeholder="Length of the product" type="number" 
                                    value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormDescription>Length of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Media</h1>

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageInput value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>Images of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Featured</FormLabel>
                                <FormDescription>Is this product featured?</FormDescription>
                            </div>
                        </FormItem>
                    )}
                />


                <div className="flex flex-row justify-end">
                    <SubmitButton text={mode === "create" ? "Create Product" : "Update Product"}
                        loading={createPending || updatePending}
                    />
                </div>
            </form>
        </Form>
    )
}

export default ProductForm