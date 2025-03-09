import { useEffect } from "react"
import { useColorModeValue } from "./store/use-color-mode-store"
import { Router } from "./routes/router"
import { Toaster } from "./components/ui/sonner"
function App() {
  const colorMode = useColorModeValue()
  useEffect(() => {
    const documentElement = document.documentElement
    documentElement.classList.remove("light", "dark")
    documentElement.classList.add(colorMode)
  }, [colorMode])

  return (
    <div className="min-h-screen">
      <Router />
      <Toaster />
    </div>
  )
}

export default App