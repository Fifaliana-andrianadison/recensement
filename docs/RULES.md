# Règles métier — Paroasy

## 1. Gestion des Faritra

- Chaque **Faritra** représente une zone géographique de la paroisse
- Chaque personne appartient à un et un seul Faritra
- Un Faritra a un nom unique et une adresse (lieu de rassemblement)

## 2. Ajout d'une personne

Conditions requises :
- Le nom (`anarana`) ne peut pas être vide
- La date de naissance (`datyNaterahana`) doit être au format `DD/MM/YYYY`
- Si `vitaBatisa` est `"ENY"`, la date de communion (`datyMandray`) est obligatoire et doit être au format `DD/MM/YYYY`
- Le sexe (`lahyVavy`) doit être `"L"` ou `"v"`
- `teteDeFamille` et `deces` sont des booléens, par défaut `false`

## 3. Modification d'une personne

- Les mêmes règles que l'ajout s'appliquent
- Tous les champs sont modifiables
- L'`id` reste inchangé

## 4. Suppression d'une personne

- Confirmation requise avant suppression (`window.confirm`)
- La suppression est définitive

## 5. Gestion des décès

- Une personne peut être marquée comme décédée (`deces: true`)
- Action réversible (possibilité de annuler le statut décédé)
- Affichage : nom en rouge, barré, avec une croix ✝
- Les décédés sont exclus du **Publipostage**
- Les décédés sont comptés dans le **Dashboard** (ligne "Nodimandry")

## 6. Publipostage

- Affiche uniquement les **têtes de famille** (`teteDeFamille === true`) encore **vivants** (`deces === false`)
- Chaque tête de famille a sa propre page dans le PDF généré
- S'utilise avec la fonction d'impression du navigateur
- Le nom du faritra **n'apparaît plus** sur les cartes de publipostage

## 7. Export PDF Tableau

- Exporte les **résultats filtrés** du tableau
- Inclut l'en-tête avec le nom du Faritra et le nombre de personnes
- Utilise `window.print()` pour la génération PDF
- Les filtres actifs (nom, âge, etc.) sont pris en compte

## 8. Dashboard

- Affiche les statistiques globales de tous les Faritra
- Les cartes statistiques montrent : Total, Lahy, Vavy, Batisa, Mpandray, Tête de famille, Nodimandry
- Le graphique à barres permet de comparer les Faritra sur différentes métriques (âge, sexe, sacrements)
- Le tableau récapitulatif montre les données par Faritra

## 9. Navigation

- **Sidebar** : navigation entre Dashboard et chaque Faritra
- **Navbar** : fil d'Ariane (breadcrumb), affiche le nom de la vue active
- Sur mobile, la sidebar est masquée et accessible via un bouton hamburger

## 10. Interface utilisateur

- Support du **mode sombre** (classe `.dark` sur `<html>`)
- Responsive (mobile, tablette, desktop)
- Thème basé sur des variables CSS personnalisées
