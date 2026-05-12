import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import FaritraTabs from "./components/FaritraTabs"
import { FaritraProvider } from "./components/FaritraContext"

export default function App() {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <FaritraProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <div className="flex flex-1 flex-col lg:pl-64">
          <Navbar activeView={activeView} onNavigate={setActiveView} />
          <main className="flex-1 space-y-6 p-4 lg:p-6">
            <FaritraTabs activeView={activeView} />
          </main>
        </div>
      </div>
    </FaritraProvider>
  )
}
