import { DataTable } from '@/components/shared/data-table';
import { useGetProducts } from '@/hooks/products/use-get-products'
import { IProduct } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { ProductStatus } from '@/lib/enums';
import LoadingTable from '@/components/shared/loading-table';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/shared/search-input';
import Pagination from '@/components/shared/pagination';
import ErrorState from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useDeleteModal } from '@/hooks/use-model';
import AlertModal from '@/components/shared/alert-modal';
import { useDeleteProduct } from '@/hooks/products/use-delete-product';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const StatusRecord: Record<ProductStatus, { label: string; bg: string }> = {
    [ProductStatus.LOW_STOCK]: {
        label: "Low Stock",
        bg: "bg-yellow-600"
    },
    [ProductStatus.IN_STOCK]: {
        label: "In Stock",
        bg: "bg-green-600"
    },
    [ProductStatus.OUT_OF_STOCK]: {
        label: "Out of Stock",
        bg: "bg-red-600"
    }
}

function ProductsTable() {
    const { data, isLoading, error, getProducts } = useGetProducts();
    const { deleteProduct, isPending: isDeletePending } = useDeleteProduct();

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedItem, setSelectedItem] = useState<IProduct | null>(null);
    const { isOpen, open, close } = useDeleteModal();
    const columns: ColumnDef<IProduct>[] = [
        {
            accessorKey: "_id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: (info) => {
                return formatCurrency(info.getValue() as number);
            }
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => {
                const row = info.row.original;
                const status = row.status;

                return (
                    <Badge
                        variant={"outline"}
                        className={cn(
                            `rounded-xs border-none ${StatusRecord[status].bg} text-white`,
                        )}
                    >
                        {StatusRecord[status].label}
                    </Badge>

                )
            }
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
        },
        {
            header: "Actions",
            cell: (info) => {
                const row = info.row.original;
                const id = row._id;

                return (
                    <div className="flex flex-row gap-2">
                        <Button size={"icon"} asChild variant={"ghost"}>
                            <Link to={`/admin/products/edit/${id}`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>

                        <Button size={"icon"} variant={"ghost"} type='button' onClick={() => {
                            setSelectedItem(row);
                            open();
                        }} >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        },
    ]

    const query = useMemo(() => {
        return searchParams.toString();
    }, [searchParams])

    useEffect(() => {
        getProducts(query);
    }, [query])

    if (isLoading) return <LoadingTable />
    if (error) return <ErrorState error={error} />

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row justify-between">
                <SearchInput />

                <div className="flex items-center gap-4">
                    <Select value={searchParams.get('status') || ''}
                        onValueChange={(value) => {
                            if (value === "all") searchParams.delete('status')
                            else {
                                searchParams.set('status', value)
                                searchParams.delete('page')
                            }

                            setSearchParams(searchParams)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Product Status</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DataTable columns={columns} data={data.records} />

            {
                selectedItem && <AlertModal
                    open={isOpen}
                    title="Delete Product"
                    description="Are you sure you want to delete this product?"
                    onClose={close}
                    isPending={isDeletePending}
                    onConfirm={async () => {
                        if (selectedItem) {
                            await deleteProduct(selectedItem._id);
                            setSelectedItem(null);
                            searchParams.delete('page');
                            setSearchParams(searchParams);
                        }
                    }}
                />
            }

            <Pagination
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
            />
        </div>
    )
}

export default ProductsTable