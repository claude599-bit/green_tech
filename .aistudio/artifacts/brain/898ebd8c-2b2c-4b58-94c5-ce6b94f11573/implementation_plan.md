# Plateforme Web Métier GTEC — Clients, Techniciens & Administration

Plateforme web intégrée pour Green Tech Energy Cameroon (GTEC), combinant un site vitrine à forte identité visuelle technique et écologique, des espaces applicatifs dédiés pour les clients, les techniciens et les coordinateurs GTEC, ainsi qu'un copilote d'expertise technique alimenté par Gemini.

### User Review & Critical Decisions

> [!IMPORTANT]
> Les trois décisions fondamentales confirmées lors de la phase de cadrage :
> - **Persistance & Sécurité Backend** : Backend Express complet avec base de données relationnelle persistante, sessions sécurisées par jetons/cookies et contrôle d'accès strict par rôle côté serveur (RBAC).
> - **Rôle de l'IA Gemini** : Assistant polyvalent à double vocation : aide au pré-diagnostic et à la qualification de devis pour les clients, et assistance technique de terrain avec raisonnement approfondi (`gemini-4-argon` avec ThinkingLevel.HIGH) pour les techniciens et administrateurs.
> - **Données de démarrage & Démonstration** : Intégration d'un sélecteur de rôle rapide en environnement de test avec comptes préconfigurés (Client particulier/entreprise, Technicien certifié, Technicien en attente, Super-Admin GTEC) et interventions types basées sur le contexte camerounais (Douala, Yaoundé, Bafoussam, etc.).

---

### 1. Overview & Core Concept

- **Ce que fait l'application** : Numérise l'ensemble de la chaîne de valeur technique de GTEC (énergie solaire, génie électrique, climatisation/froid industriel, génie informatique et BTP durable), de la prise de contact initiale au rapport d'intervention finalisé et au devis validé.
- **Publics cibles** :
  1. *Clients GTEC (Particuliers & Entreprises)* : Déposent des demandes de dépannage/installation, suivent l'avancement en temps réel, consultent les devis et accèdent à l'historique de leurs installations.
  2. *Techniciens de terrain* : Reçoivent leurs ordres de mission, gèrent leur calendrier d'intervention, consultent les schémas techniques avec l'IA et rédigent leurs rapports de fin de travaux avec pièces jointes.
  3. *Administration & Dispatch GTEC* : Qualifient les demandes entrantes, planifient et assignent les missions aux techniciens qualifiés selon leur zone et charge, valident les comptes techniciens et supervisent le journal d'audit.
- **Valeur ajoutée** : Suppression des pertes d'informations sur WhatsApp/appels informels, traçabilité rigoureuse des interventions, réduction du temps de devis grâce à l'analyse intelligente et valorisation de l'expertise camerounaise dans les énergies vertes.

---

### 2. User Experience & Visual Design

#### Parcours Utilisateurs Clés

1. **Parcours Découverte & Demande Immédiate (Public)** :
   - Navigation fluide entre les spécialités GTEC (Solaire & Électrique, Froid & Climatisation, Informatique & Réseaux, BTP).
   - Formulaire guidé de demande de devis en 3 étapes avec calcul d'urgence et sélection géographique (villes/quartiers du Cameroun).
   - Assistant d'estimation interactif propulsé par Gemini pour guider le choix de la puissance ou du type d'équipement.
2. **Espace Client Connecté** :
   - Tableau de bord synthétique avec statut temps réel des demandes (`Nouvelle`, `Qualifiée`, `Technicien assigné`, `Intervention planifiée`, `Terminée`).
   - Consultation et validation formelle des devis chiffrés.
   - Messagerie directe sur chaque dossier et téléchargement des rapports techniques.
3. **Espace Technicien Connecté** :
   - Centre de mission mobile-first avec détails d'accès au site, consignes de sécurité et créneaux horaires.
   - Acceptation/déclinaison de mission avec motif immédiat notifiant l'administration.
   - Module de saisie de compte rendu d'intervention : constats, pièces remplacées, photos avant/après et signature de conformité.
4. **Espace Administration & Régulation GTEC** :
   - Tour de contrôle des interventions avec tableau Kanban ou liste filtrable par ville, domaine et priorité.
   - Moteur d'attribution de mission avec visibilité sur les compétences certifiées et la disponibilité des techniciens.
   - Validation des nouveaux profils techniciens et consultation du journal d'audit horodaté.

#### Identité Visuelle & Thème Graphique

- **Palette GTEC** :
  - `Vert Forêt` : `#075B35` (Accentuation principale, identité marque)
  - `Vert Profond` : `#063D2A` (Surfaces de contraste, en-têtes et cartes clés)
  - `Vert Énergie` : `#69B536` (Actions positives, boutons de validation, statut actif)
  - `Ivoire Technique` : `#F5F7F1` (Fond neutre apaisant pour les données denses)
  - `Charbon Industriel` : `#202622` (Typographie textuelle haute lisibilité)
  - `Blanc Pur` : `#FFFFFF` (Surfaces de travail et formulaires)
- **Typographie** :
  - *Titres & Marque* : `Space Grotesk` (allure technique, moderne et rigoureuse).
  - *Corps & Formulaires* : `Manrope` (rondeur chaleureuse, excellente lisibilité).
  - *Chiffres & Réf. Techniques* : `IBM Plex Mono` avec `tabular-nums` pour les numéros de dossiers (`GTEC-2026-XXXX`) et montants en FCFA.
- **Règles Anti-Slop & Ergonomie** :
  - Pas de pills superflues ou de faux indicateurs décoratifs : les métadonnées sont séparées par des délimiteurs typographiques discrets (`·` ou `/`).
  - Barres de statut claires basées sur le workflow réel et les contrastes WCAG AA.
  - Transitions fluides inférieures à 200ms et réactivité totale smartphone/tablette/bureau.

---

### 3. Key Product Decisions & Trade-Offs

- **Décision 1 : Architecture Fullstack Express + SQLite/Stockage Persistant**
  - *Approche retenue* : Serveur backend Express intégré au port 3000 avec stockage relationnel persistant, système d'authentification par sessions chiffrées et vérification systématique des rôles sur chaque endpoint d'API.
  - *Raison* : Fournit une solution immédiate, 100% opérationnelle sans dépendance à des clés tierces payantes ou configurations distantes bloquantes, tout en garantissant des règles de sécurité serveur infranchissables.
  - *Alternatives écartées* : Simulation front-end en mémoire (rejetée car non conforme aux exigences d'une vraie plateforme métier) ; solutions cloud externes qui nécessitent des identifiants non injectés.
- **Décision 2 : Double Moteur IA Gemini (Rapide vs Réflexion Approfondie)**
  - *Approche retenue* :
    - `gemini-3.1-flash-lite` pour les auto-complétions et résumés d'état ultra-rapides.
    - `gemini-3.8-flash` pour la conversation interactive et le dimensionnement de devis client.
    - `gemini-4-argon` avec `thinkingLevel: ThinkingLevel.HIGH` pour les diagnostics techniques complexes et les analyses de pannes industrielles/solaires soumises par les techniciens.
  - *Raison* : Respecte à la lettre les directives de performance et les fonctionnalités demandées tout en évitant les surcoûts de latence sur les requêtes simples.
- **Décision 3 : Sélecteur de Rôles de Démonstration Débrayable**
  - *Approche retenue* : Bandeau discret permettant de basculer en 1 clic entre les comptes pré-créés (Client résidentiel à Douala, Client entreprise à Yaoundé, Technicien frigoriste, Technicien solaire, Admin GTEC), tout en conservant les formulaires d'inscription et de connexion indépendants.
  - *Raison* : Permet au testeur et au client final de vérifier immédiatement les 18 scénarios d'acceptation du cahier des charges sans devoir créer manuellement 5 comptes distincts à chaque test.

---

### 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React 19 + Vite)                      │
│                                                                              │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐  │
│  │     Site Public       │  │    Espace Client      │  │ Espace Technicien│  │
│  │ (Accueil, Services,   │  │ (Mes demandes, Devis, │  │ (Missions reçues,│  │
│  │  Demande devis, etc.) │  │  Suivi, Profil)       │  │  Planning, Rapp.)│  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬─────────┘  │
│              │                          │                       │            │
│              └────────────────────┬─────┴───────────────────────┘            │
│                                   ▼                                          │
│                         ┌───────────────────────┐                            │
│                         │ Espace Administrateur │                            │
│                         │ (Dispatch, Techniciens│                            │
│                         │  Audit, Services GTEC)│                            │
│                         └───────────┬───────────┘                            │
│                                     │                                        │
│  ┌──────────────────────────────────┴─────────────────────────────────────┐  │
│  │               Copilote IA GTEC (Modal & Assistant Intégré)             │  │
│  └──────────────────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │ REST API (/api/*)
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Express.js / TSX)                         │
│                                                                              │
│  ┌─────────────────────────┐  ┌────────────────────────┐  ┌───────────────┐  │
│  │     Auth & RBAC Guards  │  │   Service Request &    │  │ Notifications │  │
│  │ (Sessions, Hash, Rôles) │  │   Workflow Dispatcher  │  │ & Audit Logs  │  │
│  └────────────┬────────────┘  └───────────┬────────────┘  └───────┬───────┘  │
│               │                           │                       │          │
│               ▼                           ▼                       ▼          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                Moteur de Persistance Relationnelle                     │  │
│  │         (Users, Profiles, Requests, Missions, Reports, Quotes)         │  │
│  └────────────────────────────────────────┬───────────────────────────────┘  │
│                                           │                                  │
│  ┌────────────────────────────────────────┴───────────────────────────────┐  │
│  │                  Service Gemini API (@google/genai)                    │  │
│  │   - gemini-3.1-flash-lite (requêtes rapides / résumés)                 │  │
│  │   - gemini-3.8-flash (assistant généraliste / devis)                   │  │
│  │   - gemini-4-argon + ThinkingLevel.HIGH (diagnostics complexes)        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Modèle de Données Clé

- **Utilisateurs & Profils** : Identifiant unique, email, mot de passe hashé, rôle (`client`, `technicien`, `admin`), état du compte (`actif`, `en_attente_validation`, `suspendu`), métadonnées entreprise/particulier, téléphone camerounais (+237).
- **Profils Techniciens** : Spécialités techniques (`solaire_electrique`, `froid_climatisation`, `informatique_reseau`, `genie_civil`), années d'expérience, zone de couverture géographique (Douala, Yaoundé, etc.), disponibilité calendrier, statut de vérification des compétences par GTEC.
- **Demandes de Service & Dossiers** : Référence normalisée (ex: `GTEC-2026-E042`), client associé, catégorie de service, type d'intervention (dépannage urgent, installation, maintenance préventive, audit), localisation précise (ville, quartier), créneau souhaité, niveau d'urgence.
- **Workflow & États de Suivi** : `nouvelle` $\rightarrow$ `a_qualifier` $\rightarrow$ `qualifiee` $\rightarrow$ `technicien_attribue` $\rightarrow$ `mission_acceptee` $\rightarrow$ `en_cours` $\rightarrow$ `rapport_soumis` $\rightarrow$ `validee_gtec` $\rightarrow$ `terminee` (avec gestion des cas `refusee` et `reattribution`).
- **Comptes Rendus d'Intervention** : Diagnostic final, travaux réalisés, pièces ou consommables utilisés, temps passé, recommandations pérennes pour le client, horodatage de clôture.
- **Devis & Facturation Estimative** : Liste des prestations, tarifs en Francs CFA (XAF), taux de TVA/taxes, statut du devis (`brouillon`, `transmis`, `approuve`, `rejete`), traçabilité des validations.
- **Notifications & Journal d'Audit** : Horodatage à la seconde, acteur à l'origine de l'action, type d'événement, destination de l'alerte.

---
