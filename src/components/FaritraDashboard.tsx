import { type ElementType } from "react"
import { Users, Mars, Venus, Check, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { Faritra } from "../data/faritra"
import FaritraChart from "./FaritraChart"

type FaritraStats = {
  id: string
  name: string
  total: number
  lahy: number
  vavy: number
  batisaEny: number
  batisaTsia: number
  mpandrayEny: number
  mpandrayTsia: number
  teteDeFamille: number
  deces: number
}

function computeStats(f: Faritra): FaritraStats {
  const p = f.personnes.filter((x) => !x.deces)
  const deces = f.personnes.filter((x) => x.deces).length
  return {
    id: f.id,
    name: f.name,
    total: p.length,
    lahy: p.filter((x) => x.lahyVavy === "L").length,
    vavy: p.filter((x) => x.lahyVavy === "v").length,
    batisaEny: p.filter((x) => x.vitaBatisa === "ENY").length,
    batisaTsia: p.filter((x) => x.vitaBatisa === "TSIA").length,
    mpandrayEny: p.filter((x) => x.mpandray === "ENY").length,
    mpandrayTsia: p.filter((x) => x.mpandray === "TSIA").length,
    teteDeFamille: p.filter((x) => x.teteDeFamille).length,
    deces,
  }
}

const statConfig = [
  { icon: Users, label: "Total olona" },
  { icon: Mars, label: "Lahy" },
  { icon: Venus, label: "Vavy" },
  { icon: Check, label: "Vita Batisa" },
  { icon: Check, label: "Mpandray" },
  { icon: UserCheck, label: "Loham-pianakaviana" },
]

function StatCard({ icon: Icon, label, value }: { icon: ElementType; label: string; value: number }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shadow-sm ring-1 ring-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaritraDashboard({ faritraList }: { faritraList: Faritra[] }) {
  const allStats = faritraList.map(computeStats)
  const total = allStats.reduce((a, s) => a + s.total, 0)
  const totalLahy = allStats.reduce((a, s) => a + s.lahy, 0)
  const totalVavy = allStats.reduce((a, s) => a + s.vavy, 0)
  const totalBatisa = allStats.reduce((a, s) => a + s.batisaEny, 0)
  const totalMpandray = allStats.reduce((a, s) => a + s.mpandrayEny, 0)
  const totalTete = allStats.reduce((a, s) => a + s.teteDeFamille, 0)

  const values = [total, totalLahy, totalVavy, totalBatisa, totalMpandray, totalTete]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">Tabilao fanaraha-maso</h2>
          <p className="text-xs text-muted-foreground">Famintinana ny faritra rehetra</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {statConfig.map((cfg, i) => (
          <StatCard key={cfg.label} {...cfg} value={values[i]} />
        ))}
      </div>

      <FaritraChart faritraList={faritraList} />

      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="border-b bg-primary/[0.02]">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Faritra tsirairay
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-primary/5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-3 sm:px-4">Faritra</th>
                  <th className="px-3 py-3 sm:px-4">Total</th>
                  <th className="hidden sm:table-cell px-3 py-3 sm:px-4">Lahy</th>
                  <th className="hidden sm:table-cell px-3 py-3 sm:px-4">Vavy</th>
                  <th className="px-3 py-3 sm:px-4">Batisa</th>
                  <th className="hidden md:table-cell px-3 py-3 sm:px-4">Tsy Batisa</th>
                  <th className="px-3 py-3 sm:px-4">Mpandray</th>
                  <th className="hidden md:table-cell px-3 py-3 sm:px-4">Tsy Mpandray</th>
                  <th className="hidden sm:table-cell px-3 py-3 sm:px-4">Tête</th>
                  <th className="hidden sm:table-cell px-3 py-3 sm:px-4">Nodimandry</th>
                </tr>
              </thead>
              <tbody>
                {allStats.map((s) => {
                  const pct = (val: number) => s.total > 0 ? ` (${((val / s.total) * 100).toFixed(0)}%)` : ""
                  return (
                    <tr
                      key={s.id}
                      className="border-b last:border-0 transition-colors duration-150 hover:bg-primary/[0.02]"
                    >
                      <td className="px-3 py-3 font-medium capitalize sm:px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                            {s.name.charAt(0).toUpperCase()}
                          </span>
                          {s.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold sm:px-4">{s.total}</td>
                      <td className="hidden sm:table-cell px-3 py-3 sm:px-4">{s.lahy}{pct(s.lahy)}</td>
                      <td className="hidden sm:table-cell px-3 py-3 sm:px-4">{s.vavy}{pct(s.vavy)}</td>
                      <td className="px-3 py-3 font-medium sm:px-4">{s.batisaEny}{pct(s.batisaEny)}</td>
                      <td className="hidden md:table-cell px-3 py-3 font-medium sm:px-4">{s.batisaTsia}{pct(s.batisaTsia)}</td>
                      <td className="px-3 py-3 font-medium sm:px-4">{s.mpandrayEny}{pct(s.mpandrayEny)}</td>
                      <td className="hidden md:table-cell px-3 py-3 font-medium sm:px-4">{s.mpandrayTsia}{pct(s.mpandrayTsia)}</td>
                      <td className="hidden sm:table-cell px-3 py-3 font-medium sm:px-4">{s.teteDeFamille}{pct(s.teteDeFamille)}</td>
                      <td className="hidden sm:table-cell px-3 py-3 font-medium sm:px-4">{s.deces}{pct(s.deces)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
