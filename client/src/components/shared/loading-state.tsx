
import Container from './container'
import { Loader2 } from 'lucide-react'

function LoadingState() {
  return (
    <Container className='min-h-[80vh] flex items-center justify-center'>
        <Loader2 size={64} />
    </Container>
  )
}

export default LoadingState