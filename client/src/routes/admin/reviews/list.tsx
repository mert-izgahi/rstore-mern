import Container from "@/components/shared/container"
import ReviewsTable from "@/components/tables/reviews-table"



const Page = () => {

    return (
        <Container className="flex flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Reviews</h1>
                    <p className="text-muted-foreground">
                        List of reviews in the store
                    </p>
                </div>
            </div>

            <div>
                <ReviewsTable />
            </div>
        </Container>
    )
}



export { Page as AdminReviewsListPage }