import { useFaritra } from "./FaritraContext"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { MapPin, Users } from "lucide-react"
import FaritraTable from "./FaritraTable"
import FaritraDashboard from "./FaritraDashboard"

type FaritraTabsProps = {
  activeView: string
}

export default function FaritraTabs({ activeView }: FaritraTabsProps) {
  const { faritraList } = useFaritra()

  if (activeView === "dashboard") {
    return <FaritraDashboard faritraList={faritraList} />
  }

  const faritra = faritraList.find((f) => f.id === activeView)
  if (!faritra) return null

  const actif = faritra.personnes.filter((p) => !p.deces).length
  const deces = faritra.personnes.filter((p) => p.deces).length

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-[#fafafa] dark:bg-[#0d0d0d]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f0f0] text-[#404040] ring-1 ring-black/10 dark:bg-[#1a1a1a] dark:text-[#a3a3a3] dark:ring-white/10">
                <MapPin className="h-4 w-4" />
              </div>
              {faritra.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold">
              {actif} velona
            </Badge>
            {deces > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold">
                {deces} nodimandry
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold">
              <Users className="h-3.5 w-3.5" />
              {faritra.personnes.length} olona
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-4">
        <FaritraTable personnes={faritra.personnes} faritraId={faritra.id} />
      </CardContent>
    </Card>
  )
}
