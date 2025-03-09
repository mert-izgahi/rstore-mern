import { Skeleton } from "../ui/skeleton"


function LoadingTable() {
    return (
        <div className="flex flex-col gap-2">
            {
                new Array(5).fill(0).map((_, index) => (
                    <Skeleton key={index} className='h-10' />
                ))
            }
        </div>
    )
}

export default LoadingTable