import {
  Check,
  X,
  Mars,
  Venus,
  Phone,
  MapPin,
  Search,
  Hash,
  Filter,
  Printer,
  Pencil,
  Trash2,
  Cross,
  Plus,
  SlidersHorizontal,
  FileDown,
  Upload,
} from "lucide-react"
import { useState, useMemo, useRef } from "react"
import * as XLSX from "xlsx"
import type { Personne } from "../data/faritra"
import { useFaritra } from "./FaritraContext"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Label } from "./ui/label"

import { calculateAge, getAgeCategory, ageCategoryLabels, type AgeCategory } from "../lib/age"
import PersonForm from "./PersonForm"

function StatusBadge({ value }: { value: string }) {
  if (value === "ENY") {
    return (
      <Badge variant="success" className="inline-flex items-center gap-1 text-[10px] font-semibold">
        <Check className="h-3 w-3" /> ENY
      </Badge>
    )
  }
  return (
    <Badge variant="warning" className="inline-flex items-center gap-1 text-[10px] font-semibold">
      <X className="h-3 w-3" /> TSIA
    </Badge>
  )
}

function GenderBadge({ value }: { value: string }) {
  if (value === "L") {
    return (
      <Badge variant="default" className="inline-flex items-center gap-1 text-[10px] font-semibold">
        <Mars className="h-3 w-3" /> L
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px] font-semibold">
      <Venus className="h-3 w-3" /> v
    </Badge>
  )
}

function DecesBadge() {
  return (
    <Badge variant="destructive" className="inline-flex items-center gap-1 text-[10px] font-semibold">
      <Cross className="h-3 w-3" /> Nodimandry
    </Badge>
  )
}

function PublipostageView({ personnes }: { personnes: Personne[] }) {
  const printRef = useRef<HTMLDivElement>(null)
  const tetes = personnes.filter((p) => p.teteDeFamille && !p.deces)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm print:hidden">
        <div>
          <p className="text-sm font-semibold">Publipostage — {tetes.length} tête(s) de famille</p>
          <p className="text-xs text-muted-foreground">Tsindrio ny Imprimer mba hamoaka PDF</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
      </div>

      <div ref={printRef} className="publipostage-print">
        {tetes.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground print:hidden">
            Tsy misy tête de famille
          </p>
        ) : (
          <div className="publipostage-grid">
            {tetes.map((p, i) => (
              <div key={p.id} className="publipostage-card">
                <p className="publipostage-name">{p.anarana.toUpperCase()}</p>
                <p className="publipostage-addr">{p.adiresy.toUpperCase()}</p>
                {i < tetes.length - 1 && <div className="publipostage-separator" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type FaritraTableProps = {
  personnes: Personne[]
  faritraId: string
}

export default function FaritraTable({ personnes, faritraId }: FaritraTableProps) {
  const { updatePersonne, deletePersonne, markDeces, addPersonne, faritraList } = useFaritra()
  const currentFaritra = faritraList.find((f) => f.id === faritraId)
  const [searchNom, setSearchNom] = useState("")
  const [searchNum, setSearchNum] = useState("")
  const [ageFilter, setAgeFilter] = useState<AgeCategory | "all">("all")
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [teteOnly, setTeteOnly] = useState(false)
  const [publipostage, setPublipostage] = useState(false)
  const [pdfTable, setPdfTable] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editPersonne, setEditPersonne] = useState<Personne | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState("")

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: "array" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(ws, { header: 1 })
        let count = 0
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i]
          if (!r || !r[1]?.toString().trim()) continue
          const teteRaw = r[9]?.toString().trim().toLowerCase() || ""
          const isTete = ["eny", "oui", "1", "true", "x", "✓", "o"].includes(teteRaw)
          addPersonne(faritraId, {
            anarana: r[1]?.toString().trim() || "",
            datyNaterahana: r[2]?.toString().trim() || "",
            lahyVavy: (r[3]?.toString().trim() === "L" ? "L" : "v") as "L" | "v",
            vitaBatisa: (r[4]?.toString().trim() === "ENY" ? "ENY" : "TSIA") as "ENY" | "TSIA",
            mpandray: (r[5]?.toString().trim() === "ENY" ? "ENY" : "TSIA") as "ENY" | "TSIA",
            datyMandray: r[6]?.toString().trim() || "",
            tel: r[7]?.toString().trim() || "",
            adiresy: r[8]?.toString().trim() || "",
            teteDeFamille: isTete,
            deces: false,
          })
          count++
        }
        setImportMsg(`${count} olona voarakitra`)
        setTimeout(() => setImportMsg(""), 3000)
      } catch {
        setImportMsg("Erreur")
        setTimeout(() => setImportMsg(""), 3000)
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ""
  }

  const filtered = useMemo(() => {
    let result = [...personnes]

    if (searchNom.trim()) {
      const q = searchNom.toLowerCase().trim()
      result = result.filter((p) => p.anarana.toLowerCase().includes(q))
    }

    if (searchNum.trim()) {
      result = result.filter((p) => String(p.id) === searchNum.trim())
    }

    result = result.filter((p) => {
      const age = calculateAge(p.datyNaterahana)
      if (ageFilter !== "all" && getAgeCategory(age) !== ageFilter) return false
      if (ageMin !== "" && age < Number(ageMin)) return false
      if (ageMax !== "" && age > Number(ageMax)) return false
      return true
    })

    if (teteOnly) {
      result = result.filter((p) => p.teteDeFamille)
    }

    if (publipostage) {
      result = result.filter((p) => p.teteDeFamille && !p.deces)
    }

    return result
  }, [personnes, searchNom, searchNum, ageFilter, ageMin, ageMax, teteOnly, publipostage])

  const handleSave = (data: Omit<Personne, "id">) => {
    if (editPersonne) {
      updatePersonne(faritraId, editPersonne.id, data)
    } else {
      addPersonne(faritraId, data)
    }
    setShowForm(false)
    setEditPersonne(null)
  }

  const handleEdit = (p: Personne) => {
    setEditPersonne(p)
    setShowForm(true)
  }

  const handleDelete = (p: Personne) => {
    if (window.confirm(`Vonoy ve ny olona "${p.anarana}"?`)) {
      deletePersonne(faritraId, p.id)
    }
  }

  if (pdfTable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm print:hidden">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={pdfTable}
              onChange={() => setPdfTable(false)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <FileDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">PDF Tableau</span>
          </label>
          <span className="text-xs text-muted-foreground">Avelao hiverina amin'ny tableau</span>
        </div>

        <div className="table-pdf-print">
          <div className="table-pdf-header">
            <h2>{currentFaritra?.name ?? "Faritra"} — Lisitry ny mpikambana</h2>
            <p>Voasivana: {filtered.length} olona</p>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{width:"4%"}}>#</th>
                <th style={{width:"22%"}}>Anarana</th>
                <th style={{width:"12%"}}>Daty naterahana</th>
                <th style={{width:"6%"}}>Taona</th>
                <th style={{width:"4%"}}>L/V</th>
                <th style={{width:"6%"}}>Batisa</th>
                <th style={{width:"8%"}}>Mpandray</th>
                <th style={{width:"12%"}}>Daty manpray</th>
                <th style={{width:"12%"}}>Tel</th>
                <th style={{width:"14%"}}>Adiresy</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const age = calculateAge(p.datyNaterahana)
                return (
                  <tr key={p.id}>
                    <td style={{textAlign:"center"}}>{p.id}</td>
                    <td>{p.anarana}{p.teteDeFamille ? " (Tête)" : ""}</td>
                    <td>{p.datyNaterahana}</td>
                    <td style={{textAlign:"center"}}>{age}</td>
                    <td style={{textAlign:"center"}}>{p.lahyVavy === "L" ? "L" : "V"}</td>
                    <td style={{textAlign:"center"}}>{p.vitaBatisa === "ENY" ? "O" : "N"}</td>
                    <td style={{textAlign:"center"}}>{p.mpandray === "ENY" ? "O" : "N"}</td>
                    <td>{p.datyMandray || "—"}</td>
                    <td>{p.tel || "—"}</td>
                    <td>{p.adiresy || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (publipostage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm print:hidden">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={publipostage}
              onChange={() => setPublipostage(false)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Printer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Publipostage</span>
          </label>
          <span className="text-xs text-muted-foreground">Avelao hiverina amin'ny tableau</span>
        </div>
        <PublipostageView personnes={personnes} />
      </div>
    )
  }

  const hasActiveFilters = searchNom || searchNum || ageFilter !== "all" || ageMin || ageMax || teteOnly

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtre sy fikarohana</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                !
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {filtered.length} / {personnes.length}
            </span>
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        {showFilters && (
          <div className="border-t px-4 pb-4 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
              <div className="space-y-1">
                <Label htmlFor="search-num" className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Hash className="h-3 w-3" /> Numero
                </Label>
                <Input
                  id="search-num"
                  placeholder="Ohatra: 1"
                  className="h-9 w-full sm:w-20"
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                />
              </div>

              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="search-nom" className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Search className="h-3 w-3" /> Anarana
                </Label>
                <Input
                  id="search-nom"
                  placeholder="Tadiavo ny anarana..."
                  className="h-9 w-full"
                  value={searchNom}
                  onChange={(e) => setSearchNom(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="age-filter" className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Filter className="h-3 w-3" /> Sokajin-taona
                </Label>
                <Select
                  id="age-filter"
                  className="h-9 w-full sm:w-40"
                  value={ageFilter}
                  onChange={(e) => {
                    setAgeFilter(e.target.value as AgeCategory | "all")
                    if (e.target.value !== "all") { setAgeMin(""); setAgeMax("") }
                  }}
                >
                  <option value="all">Rehetra</option>
                  {Object.entries(ageCategoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Filter className="h-3 w-3" /> Taona
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-9 w-full sm:w-16 text-center"
                    value={ageMin}
                    onChange={(e) => {
                      setAgeMin(e.target.value)
                      if (e.target.value !== "") setAgeFilter("all")
                    }}
                  />
                  <span className="text-xs text-muted-foreground shrink-0">—</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="99"
                    className="h-9 w-full sm:w-16 text-center"
                    value={ageMax}
                    onChange={(e) => {
                      setAgeMax(e.target.value)
                      if (e.target.value !== "") setAgeFilter("all")
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pb-1">
                <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors hover:bg-primary/5 data-[checked=true]:border-primary data-[checked=true]:bg-primary/10"
                  data-checked={teteOnly}
                >
                  <input
                    type="checkbox"
                    checked={teteOnly}
                    onChange={(e) => {
                      setTeteOnly(e.target.checked)
                      if (e.target.checked) setPublipostage(false)
                    }}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium">Tête de famille</span>
                </label>

                <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors hover:bg-primary/5 data-[checked=true]:border-primary data-[checked=true]:bg-primary/10"
                  data-checked={publipostage}
                >
                  <input
                    type="checkbox"
                    checked={publipostage}
                    onChange={(e) => {
                      setPublipostage(e.target.checked)
                      if (e.target.checked) {
                        setTeteOnly(false)
                        setAgeFilter("all")
                        setAgeMin("")
                        setAgeMax("")
                      }
                    }}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Publipostage</span>
                </label>

                <button
                  onClick={() => { setPdfTable(true); setPublipostage(false) }}
                  className="flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  PDF Tableau
                </button>
              </div>

              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={() => { setEditPersonne(null); setShowForm(true) }}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
                >
                  <Plus className="h-4 w-4" />
                  Hanampy
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-xs font-medium transition-colors hover:bg-primary/5 hover:text-foreground"
                  title="Import CSV / XLSX / ODS"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Import</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.ods"
                  onChange={handleImport}
                  className="hidden"
                />
                {importMsg && (
                  <span className="text-xs text-muted-foreground animate-pulse">{importMsg}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border shadow-sm">
        <div className="max-h-[calc(100vh-20rem)] overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 z-10 bg-primary/5 shadow-sm">
                <th className="w-10 px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">#</th>
                <th className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Anarana</th>
                <th className="hidden sm:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Daty nahaterahana</th>
                <th className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Taona</th>
                <th className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">L/V</th>
                <th className="hidden md:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Batisa</th>
                <th className="hidden md:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Mpandray</th>
                <th className="hidden lg:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Daty manpray</th>
                <th className="hidden lg:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Tel</th>
                <th className="hidden 2xl:table-cell px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-3">Adiresy</th>
                <th className="w-24 px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wider sm:px-3 sm:w-28">Hevitra</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-30" />
                      <p className="text-sm">Tsy misy olona mifanandrify amin'ny filtre</p>
                      <button
                        onClick={() => { setSearchNom(""); setSearchNum(""); setAgeFilter("all"); setAgeMin(""); setAgeMax(""); setTeteOnly(false) }}
                        className="text-xs text-foreground hover:underline"
                      >
                        Hanesorina ny filtre
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const age = calculateAge(p.datyNaterahana)
                  const isHead = p.teteDeFamille
                  const isDeces = p.deces
                  return (
                    <tr
                      key={p.id}
                       className={`border-b transition-all duration-150 ${
                        isDeces
                          ? "bg-primary/[0.02]"
                          : isHead
                          ? "bg-primary/[0.01]"
                          : ""
                      } hover:bg-primary/5`}
                    >
                      <td className={`px-2 py-2.5 sm:px-3 ${isDeces ? "text-[#a3a3a3]" : "text-muted-foreground"}`}>
                        <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
                          {isDeces ? <Cross className="h-3 w-3 shrink-0" /> : null}
                          {p.id}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 sm:px-3">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
                          <div className="flex items-center gap-1">
                            {isHead && !isDeces && (
                              <span className="inline-flex items-center rounded border border-primary/20 bg-primary/10 px-1 py-0 text-[9px] font-semibold text-primary">
                                Tête
                              </span>
                            )}
                            {isDeces && <DecesBadge />}
                          </div>
                          <span className={`text-xs sm:text-sm ${isDeces ? "text-muted-foreground line-through" : ""} ${isHead ? "font-bold" : ""}`}>
                            {p.anarana}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-2 py-2.5 text-xs text-muted-foreground sm:px-3 sm:text-sm">{p.datyNaterahana}</td>
                      <td className="px-2 py-2.5 sm:px-3">
                        <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/[0.03] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">{age} ans</span>
                      </td>
                      <td className="px-2 py-2.5 sm:px-3">
                        <GenderBadge value={p.lahyVavy} />
                      </td>
                      <td className="hidden md:table-cell px-2 py-2.5 sm:px-3">
                        <StatusBadge value={p.vitaBatisa} />
                      </td>
                      <td className="hidden md:table-cell px-2 py-2.5 sm:px-3">
                        <StatusBadge value={p.mpandray} />
                      </td>
                      <td className="hidden lg:table-cell px-2 py-2.5 text-xs text-muted-foreground sm:px-3 sm:text-sm">{p.datyMandray || "—"}</td>
                      <td className="hidden lg:table-cell px-2 py-2.5 sm:px-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="tabular-nums">{p.tel}</span>
                        </span>
                      </td>
                      <td className="hidden 2xl:table-cell px-2 py-2.5 sm:px-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="max-w-[80px] truncate lg:max-w-[120px]">{p.adiresy}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 sm:px-3">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            onClick={() => handleEdit(p)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-60 transition-all duration-200 hover:bg-primary/10 hover:text-foreground hover:opacity-100 sm:h-8 sm:w-8"
                            title="Hanova"
                          >
                            <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                          <button
                            onClick={() => markDeces(faritraId, p.id)}
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 sm:h-8 sm:w-8 ${
                              isDeces
                                ? "opacity-80 hover:bg-primary/10"
                                : "text-muted-foreground opacity-60 hover:bg-primary/10 hover:text-foreground hover:opacity-100"
                            }`}
                            title={isDeces ? "Hanesorina ny deces" : "Ho deces"}
                          >
                            <Cross className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-60 transition-all duration-200 hover:bg-primary/10 hover:text-foreground hover:opacity-100 sm:h-8 sm:w-8"
                            title="Vonoy"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PersonForm
          initial={editPersonne ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditPersonne(null) }}
        />
      )}
    </div>
  )
}
