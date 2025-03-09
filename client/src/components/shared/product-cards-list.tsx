import { IProduct } from '@/lib/types'
import LoadingState from './loading-state'
import ErrorState from './error-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { Star } from 'lucide-react'
import { Badge } from '../ui/badge'

interface ProductCardsListProps {
    products: IProduct[]
    loading: boolean
    error: string | null
}
function ProductCardsList({ products, loading, error }: ProductCardsListProps) {
    if (loading) return <LoadingState />
    if (error) return <ErrorState error={error} />
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products && products.map((product) => (
                <Card key={product._id} className="flex flex-col gap-4 rounded-xs">
                    <CardHeader className="flex justify-center h-52 p-0 relative">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        <Badge className='absolute top-2 left-2'>{product.category}</Badge>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className='mb-3'>
                            <Link to={`/products/${product._id}`}>{product.name}</Link>
                        </CardTitle>

                        <CardDescription className='flex items-center justify-between'>
                            {formatCurrency(product.price)}

                            <div className='flex items-center gap-2'>
                                {product.rating}
                                <Star className='w-4 h-4 text-yellow-500' />
                            </div>


                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ProductCardsList