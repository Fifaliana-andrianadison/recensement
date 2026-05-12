# Structure des données — Paroasy

## Type `Personne`

Représente un membre de la paroisse.

| Champ | Type | Description | Obligatoire | Contrainte |
|---|---|---|---|---|
| `id` | `number` | Identifiant unique | Oui | Auto-incrémenté par faritra |
| `anarana` | `string` | Nom et prénom | Oui | Min 1 caractère |
| `datyNaterahana` | `string` | Date de naissance | Oui | Format `DD/MM/YYYY` |
| `lahyVavy` | `"L" \| "v"` | Sexe | Oui | `L` = Lahy (homme), `v` = Vavy (femme) |
| `vitaBatisa` | `"ENY" \| "TSIA"` | Baptisé ? | Oui | `ENY` = oui, `TSIA` = non |
| `mpandray` | `"ENY" \| "TSIA"` | Communiant ? | Oui | `ENY` = oui, `TSIA` = non |
| `datyMandray` | `string` | Date de communion | Non | Format `DD/MM/YYYY`, obligatoire si `vitaBatisa === "ENY"` |
| `tel` | `string` | Numéro de téléphone | Non | Libre |
| `adiresy` | `string` | Adresse | Non | Libre |
| `teteDeFamille` | `boolean` | Chef de famille ? | Oui | `true` ou `false` |
| `deces` | `boolean` | Décédé ? | Oui | `true` ou `false`, par défaut `false` |

## Type `Faritra`

Représente un secteur/region de la paroisse.

| Champ | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique (slug) |
| `name` | `string` | Nom du faritra |
| `location` | `string` | Adresse/lieu du faritra |
| `personnes` | `Personne[]` | Liste des membres |

## Règles de validation

1. **Date de naissance** : doit être au format `DD/MM/YYYY`
2. **Baptême** : si `vitaBatisa === "ENY"`, alors `datyMandray` est obligatoire
3. **Date de communion** : si renseignée, doit être au format `DD/MM/YYYY`
4. **Affichage** : si `deces === true`, la personne s'affiche en rouge avec une croix ✝
5. **Publipostage** : ne concerne que les `teteDeFamille` vivants (`deces === false`)
6. **Dashboard** : les compteurs incluent les décédés sauf indication contraire

## Catégories d'âge

| Catégorie | Âge | Libellé |
|---|---|---|
| `zaza` | 0-12 ans | Zaza |
| `tanora` | 13-25 ans | Tanora |
| `olondehibe` | 26-59 ans | Olon-dehibe |
| `antitafita` | 60+ ans | Anti-tafita |
