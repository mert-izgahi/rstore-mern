import { DataTable } from '@/components/shared/data-table';
import { IAccount } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react'
import LoadingTable from '@/components/shared/loading-table';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/shared/search-input';
import Pagination from '@/components/shared/pagination';
import ErrorState from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAccounts } from '@/hooks/accounts/use-get-accounts';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import dayjs from 'dayjs';

function CustomersTable() {
    const { data, isLoading, error, getAccounts } = useGetAccounts();
    const [searchParams, setSearchParams] = useSearchParams();
    const columns: ColumnDef<IAccount>[] = [
        {
            header: "Customer",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <div className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage src={row.imageUrl} />
                            <AvatarFallback>{row.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-medium leading-none">{row.firstName} {row.lastName}</p>
                            <p className="text-sm text-muted-foreground">
                                Last Order : {dayjs(row.lastOrderAt).format("DD/MM/YYYY")}
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            header: "Contact",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <div className="flex flex-col gap-2">
                        <div className="font-medium leading-none flex items-center gap-2">
                            <Mail className="mr-2 h-4 w-4" />
                            {row.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="mr-2 h-4 w-4" />
                            {row.phoneNumber}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "orders",
            header: "Orders",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <p className="font-medium leading-none">{row.ordersCount}</p>
                )
            }
        },
        {
            accessorKey: "amountSpent",
            header: "Amount Spent",
            cell: (info) => {
                const row = info.row.original;

                return (
                    <p className="font-medium leading-none">{formatCurrency(row.totalSpent)}</p>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => {
                const row = info.row.original;
                
                return (
                    <div className="flex flex-row gap-2">
                        {row.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                        {row.isDeleted && <Badge variant="warning">Deleted</Badge>}
                        {!row.isBlocked && !row.isDeleted && <Badge variant="secondary">Active</Badge>}
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
                            <Link to={`/admin/customers/${id}`}>
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
        getAccounts(query);
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

            <Pagination
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
            />
        </div>
    )
}

export default CustomersTable