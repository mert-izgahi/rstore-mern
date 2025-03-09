import { DataTable } from '@/components/shared/data-table';
import { IReview } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect } from 'react'
import LoadingTable from '@/components/shared/loading-table';
import { Link } from 'react-router-dom';
import Pagination from '@/components/shared/pagination';
import ErrorState from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import dayjs from 'dayjs';
import { useGetReviews } from '@/hooks/reviews/use-get-reviews';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function ReviewsTable() {
    const { data, isLoading, error, getReviews } = useGetReviews();
    const columns: ColumnDef<IReview>[] = [
        {
            accessorKey: "_id",
            header: "ID",
        },
        {
            accessorKey: "rating",
            header: "Rating",
        },
        {
            accessorKey: "comment",
            header: "Comment",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <div className="flex flex-col">
                        <p className="font-medium leading-none truncate ">{row.comment}</p>
                    </div>
                )
            }
        },
        {
            header: "Customer",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <div className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage src={row.account.imageUrl} />
                            <AvatarFallback>{row.account.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-medium leading-none">{row.account.firstName} {row.account.lastName}</p>
                            <p className="text-sm text-muted-foreground">{row.account.email}</p>
                        </div>
                    </div>
                )
            }
        },

        {
            accessorKey: "product",
            header: "Product",
            cell: (info) => {
                const row = info.row.original;
                return row.product.name;
            }
        },

        {
            accessorKey: "createdAt",
            header: "Date",
            cell: (info) => {
                return dayjs(info.getValue() as Date).format("DD/MM/YYYY");
            }
        },


        {
            header: "Actions",
            cell: (info) => {
                const row = info.row.original;
                const id = row._id;
                return (
                    <div className="flex flex-row gap-2">
                        <Button size={"icon"} asChild variant={"ghost"}>
                            <Link to={`/admin/orders/${id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )
            }
        },
    ]

    

    useEffect(() => {
        getReviews("");
    }, [])

    if (isLoading) return <LoadingTable />
    if (error) return <ErrorState error={error} />

    return (
        <div className="w-full flex flex-col gap-4">
            <DataTable columns={columns} data={data.records} />
            <Pagination
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
            />
        </div>
    )
}

export default ReviewsTable