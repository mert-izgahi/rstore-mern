import { DataTable } from '@/components/shared/data-table';
import { IOrder } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react'
import LoadingTable from '@/components/shared/loading-table';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/shared/search-input';
import Pagination from '@/components/shared/pagination';
import ErrorState from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetOrders } from '@/hooks/orders/use-get-orders';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import dayjs from 'dayjs';
import { PaymentStatus } from '@/lib/enums';

function OrdersTable() {
    const { data, isLoading, error, getOrders } = useGetOrders();
    const [searchParams, setSearchParams] = useSearchParams();
    const columns: ColumnDef<IOrder>[] = [
        {
            accessorKey: "_id",
            header: "ID",
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
            accessorKey:"createdAt",
            header: "Date",
            cell: (info) => {
                return dayjs(info.getValue() as Date).format("DD/MM/YYYY");
            }
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: (info) => {
                return formatCurrency(info.getValue() as number);
            }
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment Status",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <div className={cn("flex flex-row gap-2", {
                        "text-red-500": row.paymentStatus === PaymentStatus.FAILED,
                        "text-yellow-500": row.paymentStatus === PaymentStatus.PENDING,
                        "text-green-500": row.paymentStatus === PaymentStatus.PAID
                    })}>
                        <span>{row.paymentStatus}</span>
                    </div>
                )
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

    const query = useMemo(() => {
        return searchParams.toString();
    }, [searchParams])

    useEffect(() => {
        getOrders(query);
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
                            if (value === "all") searchParams.delete('paymentStatus')
                            else {
                                searchParams.set('paymentStatus', value)
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
                                <SelectLabel>Payment Status</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                                <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DataTable columns={columns} data={data.records} />
            <Pagination
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
            />
        </div>
    )
}

export default OrdersTable