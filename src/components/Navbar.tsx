import { ChevronRight, Home, MapPin } from "lucide-react"
import { useFaritra } from "./FaritraContext"
import Logo from "./Logo"

type NavbarProps = {
  activeView: string
  onNavigate: (view: string) => void
}

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
  const { faritraList } = useFaritra()

  const currentFaritra = faritraList.find((f) => f.id === activeView)
  const isDashboard = activeView === "dashboard"

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 shadow-sm backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3 lg:ml-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg lg:hidden">
            <Logo className="h-8 w-8" />
          </div>

          <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
            <button
              onClick={() => onNavigate("dashboard")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground ${
                isDashboard ? "font-semibold text-foreground" : ""
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>FJKM Ambohijanaka</span>
            </button>
            {!isDashboard && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  {currentFaritra?.name}
                </span>
              </>
            )}
          </nav>

          <h1 className="text-base font-bold tracking-tight sm:hidden">
            {isDashboard ? "Tabilao fanaraha-maso" : currentFaritra?.name}
          </h1>
        </div>

        {!isDashboard && currentFaritra && (
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 rounded-lg border bg-card/50 px-3 py-1.5 text-xs shadow-sm sm:flex">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold tabular-nums text-foreground">
                {currentFaritra.personnes.length}
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-muted-foreground">Velona</span>
              <span className="font-semibold tabular-nums text-foreground">
                {currentFaritra.personnes.filter((p) => !p.deces).length}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
