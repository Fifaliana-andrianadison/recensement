import { useState, useEffect, useRef } from "react"
import { X, Cross } from "lucide-react"
import type { Personne } from "../data/faritra"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"

type PersonFormProps = {
  _faritraId?: string
  initial?: Personne
  onSave: (data: Omit<Personne, "id">) => void
  onCancel: () => void
}

const defaultForm = {
  anarana: "",
  datyNaterahana: "",
  lahyVavy: "L" as const,
  vitaBatisa: "TSIA" as const,
  mpandray: "TSIA" as const,
  datyMandray: "",
  tel: "",
  adiresy: "",
  teteDeFamille: false,
  deces: false,
}

export default function PersonForm({ _faritraId: _f, initial, onSave, onCancel }: PersonFormProps) {
  const [form, setForm] = useState<Omit<Personne, "id">>(initial ?? defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Personne, "id">, string>>>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel() }
    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [onCancel])

  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!form.anarana.trim()) e.anarana = "Ilaina ny anarana"
    if (!form.datyNaterahana.trim()) e.datyNaterahana = "Ilaina ny daty naterahana"
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.datyNaterahana))
      e.datyNaterahana = "Ampidiro amin'ny endrika DD/MM/YYYY"
    if (form.mpandray === "ENY" && !form.datyMandray.trim()) {
      e.datyMandray = "Ilaina ny daty nandray raha mpandray"
    }
    if (form.datyMandray && !/^\d{2}\/\d{2}\/\d{4}$/.test(form.datyMandray))
      e.datyMandray = "Ampidiro amin'ny endrika DD/MM/YYYY"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg animate-in rounded-2xl border bg-card shadow-dialog"
        style={{ animation: "fadeSlideIn 0.2s ease-out" }}
      >
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
        `}</style>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cross className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold">
              {initial ? "Hanova olona" : "Hanampy olona vaovao"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="anarana" className="text-sm font-medium">Anarana sy fanampiny</Label>
            <Input
              ref={firstInputRef}
              id="anarana"
              value={form.anarana}
              onChange={(e) => set("anarana", e.target.value)}
              className={errors.anarana ? "border-destructive ring-destructive/30" : ""}
              placeholder="Soraty ny anarana..."
            />
            {errors.anarana && <p className="text-xs font-medium text-destructive">{errors.anarana}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="datyNaterahana" className="text-sm font-medium">Daty naterahana</Label>
              <Input
                id="datyNaterahana"
                value={form.datyNaterahana}
                onChange={(e) => set("datyNaterahana", e.target.value)}
                placeholder="DD/MM/YYYY"
                className={errors.datyNaterahana ? "border-destructive ring-destructive/30" : ""}
              />
              {errors.datyNaterahana && <p className="text-xs font-medium text-destructive">{errors.datyNaterahana}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lahyVavy" className="text-sm font-medium">Lahy / Vavy</Label>
              <Select id="lahyVavy" value={form.lahyVavy} onChange={(e) => set("lahyVavy", e.target.value as "L" | "v")}>
                <option value="L">Lahy</option>
                <option value="v">Vavy</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vitaBatisa" className="text-sm font-medium">Vita Batisa</Label>
              <Select id="vitaBatisa" value={form.vitaBatisa} onChange={(e) => set("vitaBatisa", e.target.value as "ENY" | "TSIA")}>
                <option value="ENY">ENY</option>
                <option value="TSIA">TSIA</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mpandray" className="text-sm font-medium">Mpandray</Label>
              <Select id="mpandray" value={form.mpandray} onChange={(e) => set("mpandray", e.target.value as "ENY" | "TSIA")}>
                <option value="ENY">ENY</option>
                <option value="TSIA">TSIA</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="datyMandray" className="text-sm font-medium">Daty nandray</Label>
            <Input
              id="datyMandray"
              value={form.datyMandray}
              onChange={(e) => set("datyMandray", e.target.value)}
              placeholder="DD/MM/YYYY"
              className={errors.datyMandray ? "border-destructive ring-destructive/30" : ""}
            />
            {errors.datyMandray && <p className="text-xs font-medium text-destructive">{errors.datyMandray}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tel" className="text-sm font-medium">Telefaonina</Label>
              <Input id="tel" value={form.tel} onChange={(e) => set("tel", e.target.value)} placeholder="Ohatra: 384047" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adiresy" className="text-sm font-medium">Adiresy</Label>
              <Input id="adiresy" value={form.adiresy} onChange={(e) => set("adiresy", e.target.value)} placeholder="Soraty ny adiresy..." />
            </div>
          </div>

          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/5 has-[:checked]:border-primary has-[:checked]:bg-primary/[0.03]">
            <input
              type="checkbox"
              checked={form.teteDeFamille}
              onChange={(e) => set("teteDeFamille", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary transition-colors focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium">Loham-pianakaviana</span>
              <p className="text-xs text-muted-foreground">Ny olona mitarika ny ankohonana</p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Miverina
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
            >
              {initial ? "Hanova" : "Hanampy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
