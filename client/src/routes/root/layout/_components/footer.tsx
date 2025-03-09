import Container from '@/components/shared/container'


function Footer() {
  return (
    <div className='w-full h-16 border-t border-border'>
        <Container className='h-full flex items-center justify-center'>
            <p className='text-muted-foreground text-sm'>
                &copy; {new Date().getFullYear()} All rights reserved
            </p>
        </Container>
    </div>
  )
}

export default Footer