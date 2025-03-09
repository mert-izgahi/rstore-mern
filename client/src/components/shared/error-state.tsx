import Container from './container'

interface IProps {
  error: string | null
}
function ErrorState({ error }: IProps) {
  return (
    <Container className='min-h-[80vh] flex items-center justify-center border border-border rounded-xs'>
        <div className='text-center'>
            <h1 className='text-xl font-bold'>Error</h1>
            <p className='text-muted-foreground text-sm'>{error}</p>
        </div>
    </Container>
  )
}

export default ErrorState