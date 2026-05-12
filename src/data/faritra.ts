export type Personne = {
  id: number
  anarana: string
  datyNaterahana: string
  lahyVavy: "L" | "v"
  vitaBatisa: "ENY" | "TSIA"
  mpandray: "ENY" | "TSIA"
  datyMandray: string
  tel: string
  adiresy: string
  teteDeFamille: boolean
  deces: boolean
}

export type Faritra = {
  id: string
  name: string
  location: string
  personnes: Personne[]
}

export const faritraList: Faritra[] = [
  {
    id: "morondava",
    name: "Morondava",
    location: "LOT 105 FM Morondava",
    personnes: [
      {
        id: 1,
        anarana: "Rakoto Francois",
        datyNaterahana: "01/05/2024",
        lahyVavy: "L",
        vitaBatisa: "ENY",
        mpandray: "ENY",
        datyMandray: "01/05/2026",
        tel: "384047",
        adiresy: "LOT 105 FM morondava",
        teteDeFamille: true,
        deces: false,
      },
      {
        id: 2,
        anarana: "Rakoto Fameno",
        datyNaterahana: "01/05/2025",
        lahyVavy: "v",
        vitaBatisa: "TSIA",
        mpandray: "TSIA",
        datyMandray: "",
        tel: "384047",
        adiresy: "LOT 105 FM morondava",
        teteDeFamille: false,
        deces: false,
      },
    ],
  },
  {
    id: "antanifotsy",
    name: "Antanifotsy",
    location: "Lot A bis ANTANIFOTSY",
    personnes: [
      {
        id: 1,
        anarana: "Rakoto Francois",
        datyNaterahana: "01/05/2024",
        lahyVavy: "L",
        vitaBatisa: "ENY",
        mpandray: "ENY",
        datyMandray: "01/05/2026",
        tel: "384047",
        adiresy: "Lot A bis ANTANIFOTSY",
        teteDeFamille: true,
        deces: false,
      },
      {
        id: 2,
        anarana: "Rakoto Fameno",
        datyNaterahana: "01/05/2025",
        lahyVavy: "v",
        vitaBatisa: "TSIA",
        mpandray: "TSIA",
        datyMandray: "",
        tel: "384047",
        adiresy: "Lot A bis ANTANIFOTSY",
        teteDeFamille: false,
        deces: false,
      },
    ],
  },
  {
    id: "ambohijanaka",
    name: "Ambohijanaka",
    location: "Lot 45 AMBOHIJANAKA",
    personnes: [
      {
        id: 1,
        anarana: "Rakoto Francois",
        datyNaterahana: "01/05/2024",
        lahyVavy: "L",
        vitaBatisa: "ENY",
        mpandray: "ENY",
        datyMandray: "01/05/2026",
        tel: "384047",
        adiresy: "Lot 45 AMBOHIJANAKA",
        teteDeFamille: true,
        deces: false,
      },
      {
        id: 2,
        anarana: "Rakoto Feno",
        datyNaterahana: "01/05/2025",
        lahyVavy: "v",
        vitaBatisa: "TSIA",
        mpandray: "TSIA",
        datyMandray: "",
        tel: "384047",
        adiresy: "Lot 45 AMBOHIJANAKA",
        teteDeFamille: false,
        deces: false,
      },
      {
        id: 3,
        anarana: "Rakoto Fifaliana",
        datyNaterahana: "01/05/1999",
        lahyVavy: "v",
        vitaBatisa: "TSIA",
        mpandray: "TSIA",
        datyMandray: "",
        tel: "384047",
        adiresy: "Lot 75 FM AMBOHIJANAKA",
        teteDeFamille: false,
        deces: false,
      },
    ],
  },
]
