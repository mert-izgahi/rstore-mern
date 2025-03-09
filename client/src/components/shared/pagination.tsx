import { useState } from "react";
import { Button } from "../ui/button"
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
function Pagination({ hasNextPage, hasPrevPage }: PaginationProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [page, setPage] = useState<string>(searchParams.get('page') || "1");

    const handeNextPage = () => {
        setPage(String(parseInt(page) + 1))
        searchParams.set('page', String(parseInt(page) + 1))
        setSearchParams(searchParams)
    }

    const handlePrevPage = () => {
        setPage(String(parseInt(page) - 1))
        searchParams.set('page', String(parseInt(page) - 1))
        setSearchParams(searchParams)
    }

    return (
        <div className="flex justify-end mt-6 gap-2">
            <Button type='button' disabled={!hasPrevPage} onClick={handlePrevPage}>Prev</Button>
            <Button type='button' disabled={!hasNextPage} onClick={handeNextPage}>Next</Button>
        </div>
    )
}

export default Pagination