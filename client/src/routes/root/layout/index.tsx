import { Outlet } from "react-router-dom"
import Header from "./_components/header"
import Footer from "./_components/footer"
import Container from "@/components/shared/container"

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Container className="flex-1 overflow-hidden mb-12">
                <Outlet />
            </Container>
            <Footer />
        </div>
    )
}

export { Layout as RootLayout }