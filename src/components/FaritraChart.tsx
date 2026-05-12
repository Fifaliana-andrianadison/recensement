import { useRef, useEffect, useState } from "react"
import { PieChart } from "lucide-react"
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js"
import type { Faritra } from "../data/faritra"

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)
import { calculateAge, getAgeCategory } from "../lib/age"

const valueLabelPlugin = {
  id: "valueLabel",
  afterDraw(chart: Chart) {
    const { ctx, data, chartArea } = chart
    ctx.save()
    const dark = document.documentElement.classList.contains("dark")
    const centerX = chartArea.left + chartArea.width / 2
    const centerY = chartArea.top + chartArea.height / 2
    const cutout = 0.6
    const outerR = Math.min(chartArea.width, chartArea.height) / 2
    const innerR = outerR * cutout
    const ringW = (outerR - innerR) / data.datasets.length

    data.datasets.forEach((dataset, di) => {
      const rInner = innerR + di * ringW
      const rOuter = rInner + ringW
      const rMid = (rInner + rOuter) / 2
      const values = dataset.data as number[]
      const total = values.reduce((a: number, b: number) => a + b, 0)
      let angleAcc = -Math.PI / 2
      values.forEach((val) => {
        if (val === 0) return
        const angle = (val / total) * 2 * Math.PI
        const angleMid = angleAcc + angle / 2
        const x = centerX + Math.cos(angleMid) * rMid
        const y = centerY + Math.sin(angleMid) * rMid
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "bold 11px system-ui, sans-serif"
        ctx.fillStyle = dark ? "#1a1a1a" : "#ffffff"
        ctx.shadowColor = dark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)"
        ctx.shadowBlur = 3
        ctx.fillText(String(val), x, y)
        ctx.shadowBlur = 0
        angleAcc += angle
      })
    })
    ctx.restore()
  },
}

const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart: Chart) {
    const { width, height, ctx } = chart
    ctx.save()
    const datasets = chart.data.datasets
    if (!datasets.length) return
    const firstDataset = datasets[0]
    const total = (firstDataset.data as number[]).reduce((a, b) => a + b, 0)
    const dark = document.documentElement.classList.contains("dark")
    const centerX = width / 2
    const centerY = height / 2
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "bold 22px system-ui, sans-serif"
    ctx.fillStyle = dark ? "#e5e5e5" : "#262626"
    ctx.fillText(String(total), centerX, centerY - 10)
    ctx.font = "11px system-ui, sans-serif"
    ctx.fillStyle = dark ? "#a3a3a3" : "#737373"
    ctx.fillText("Total", centerX, centerY + 14)
    ctx.restore()
  },
}

type MetricKey =
  | "total" | "lahy" | "vavy"
  | "batisa" | "tsyBatisa"
  | "mpandray" | "tsyMpandray"
  | "teteDeFamille" | "deces"
  | "zaza" | "tanora" | "olondehibe" | "antitafita"

const metricConfig: Record<MetricKey, string> = {
  total: "Total olona",
  lahy: "Lahy",
  vavy: "Vavy",
  batisa: "Vita Batisa",
  tsyBatisa: "Tsy Batisa",
  mpandray: "Mpandray",
  tsyMpandray: "Tsy Mpandray",
  teteDeFamille: "Tête de famille",
  deces: "Nodimandry",
  zaza: "Zaza (0-12)",
  tanora: "Tanora (13-25)",
  olondehibe: "Olon-dehibe (26-59)",
  antitafita: "Anti-tafita (60+)",
}

function computeMetric(f: Faritra, metric: MetricKey): number {
  const actif = f.personnes.filter((x) => !x.deces)
  switch (metric) {
    case "total": return actif.length
    case "lahy": return actif.filter((x) => x.lahyVavy === "L").length
    case "vavy": return actif.filter((x) => x.lahyVavy === "v").length
    case "batisa": return actif.filter((x) => x.vitaBatisa === "ENY").length
    case "tsyBatisa": return actif.filter((x) => x.vitaBatisa === "TSIA").length
    case "mpandray": return actif.filter((x) => x.mpandray === "ENY").length
    case "tsyMpandray": return actif.filter((x) => x.mpandray === "TSIA").length
    case "teteDeFamille": return actif.filter((x) => x.teteDeFamille).length
    case "deces": return f.personnes.filter((x) => x.deces).length
    case "zaza": return actif.filter((x) => getAgeCategory(calculateAge(x.datyNaterahana)) === "zaza").length
    case "tanora": return actif.filter((x) => getAgeCategory(calculateAge(x.datyNaterahana)) === "tanora").length
    case "olondehibe": return actif.filter((x) => getAgeCategory(calculateAge(x.datyNaterahana)) === "olondehibe").length
    case "antitafita": return actif.filter((x) => getAgeCategory(calculateAge(x.datyNaterahana)) === "antitafita").length
  }
}

const isDark = () => document.documentElement.classList.contains("dark")

export default function FaritraChart({ faritraList }: { faritraList: Faritra[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(["total"])

  const labels = faritraList.map((f) => f.name)

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  useEffect(() => {
    if (!canvasRef.current || selectedMetrics.length === 0) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    if (chartRef.current) chartRef.current.destroy()

    const dark = isDark()
    const faritraColors = dark
      ? ["hsla(0, 0%, 70%, 0.75)", "hsla(0, 0%, 55%, 0.75)", "hsla(0, 0%, 40%, 0.75)"]
      : ["hsla(0, 0%, 35%, 0.75)", "hsla(0, 0%, 50%, 0.75)", "hsla(0, 0%, 65%, 0.75)"]

    const faritraBorders = dark
      ? ["hsla(0, 0%, 70%, 1)", "hsla(0, 0%, 55%, 1)", "hsla(0, 0%, 40%, 1)"]
      : ["hsla(0, 0%, 35%, 1)", "hsla(0, 0%, 50%, 1)", "hsla(0, 0%, 65%, 1)"]

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: selectedMetrics.map((metric) => ({
          label: metricConfig[metric],
          data: faritraList.map((f) => computeMetric(f, metric)),
          backgroundColor: faritraColors,
          borderColor: faritraBorders,
          borderWidth: 2,
          hoverBorderColor: dark ? "#ffffff" : "#000000",
          hoverBorderWidth: 2,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: dark ? "#a3a3a3" : "#737373",
              font: { size: 11 },
              padding: 14,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: dark ? "#262626" : "#ffffff",
            titleColor: dark ? "#e5e5e5" : "#262626",
            bodyColor: dark ? "#a3a3a3" : "#525252",
            borderColor: dark ? "#404040" : "#d4d4d4",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 10,
            callbacks: {
              title(items: { label: string }[]) {
                return items[0].label
              },
              label(item: { dataset: { data: number[]; label?: string }; parsed: number }) {
                const dataset = item.dataset
                const total = dataset.data.reduce((a: number, b: number) => a + b, 0)
                const pct = total > 0 ? ((item.parsed / total) * 100).toFixed(1) : "0"
                const label = dataset.label || ""
                return ` ${label}: ${item.parsed} (${pct}%)`
              },
            },
          },
        },
      },
      plugins: [centerTextPlugin, valueLabelPlugin],
    } as any)

    return () => {
      if (chartRef.current) chartRef.current.destroy()
    }
  }, [selectedMetrics, faritraList, labels])

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f0f0] text-[#404040] dark:bg-[#1a1a1a] dark:text-[#a3a3a3]">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Tabilao</h3>
            <p className="text-xs text-muted-foreground">Fampitahana ny faritra</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(metricConfig) as [MetricKey, string][]).map(([key, label]) => {
            const checked = selectedMetrics.includes(key)
            const totalVal = faritraList.reduce((s, f) => s + computeMetric(f, key), 0)
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  checked
                    ? "border-foreground bg-[#f0f0f0] dark:bg-[#1a1a1a]"
                    : "border-input text-muted-foreground hover:border-foreground/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMetric(key)}
                  className="sr-only"
                />
                <span>{label}</span>
                <span className="tabular-nums opacity-60">{totalVal}</span>
              </label>
            )
          })}
        </div>
      </div>
      <div className="flex h-64 sm:h-80 items-center justify-center">
        {selectedMetrics.length === 0 ? (
          <p className="text-sm text-muted-foreground">Fidio iray farafahakeliny</p>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  )
}
