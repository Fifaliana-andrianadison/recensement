import { LayoutDashboard, MapPin, Cross, Menu, X, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useFaritra } from "./FaritraContext"

type SidebarProps = {
  activeView: string
  onNavigate: (view: string) => void
}

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const { faritraList } = useFaritra()

  const linkClass = (id: string) =>
    `group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      activeView === id
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-[#f0f0f0] hover:text-foreground dark:hover:bg-[#1a1a1a]"
    }`

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-xl border bg-card shadow-sm transition-all hover:shadow-md active:scale-95 lg:hidden"
        aria-label={open ? "Hidy" : "Sokafy ny sidebar"}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card shadow-sm transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Cross className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">FJKM Ambohijanaka</p>
            <p className="text-[10px] leading-tight text-muted-foreground">Faritra sy mpikambana</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Navigation
          </p>
          <button
            onClick={() => { onNavigate("dashboard"); setOpen(false) }}
            className={linkClass("dashboard") + " group"}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Dashboard</span>
            {activeView === "dashboard" && <ChevronRight className="h-3.5 w-3.5 animate-pulse" />}
          </button>

          <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            Faritra
          </p>
          {faritraList.map((f) => {
            const total = f.personnes.filter((p) => !p.deces).length
            return (
              <button
                key={f.id}
                onClick={() => { onNavigate(f.id); setOpen(false) }}
                className={linkClass(f.id) + " group"}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate text-left">{f.name}</span>
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums ${
                    activeView === f.id
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-[#e5e5e5] text-[#525252] dark:bg-[#262626] dark:text-[#a3a3a3]"
                  }`}
                >
                  {total}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <p className="text-center text-[10px] text-muted-foreground/60">FJKM Ambohijanaka v1.0</p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
