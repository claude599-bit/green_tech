# PROMPT D'ÉVOLUTION BOLT — GREEN TECH ENERGY CAMEROON (GTEC)
## Transformer la landing page existante en véritable application web clients–techniciens

> **Instruction prioritaire : ne te limite pas à la landing page.** Le projet existant contient déjà une direction visuelle. Audite le code actuel, conserve et améliore ce design, puis construis une véritable application web fonctionnelle avec authentification, base de données, rôles, tableaux de bord et workflows métier. Ne remplace pas les fonctionnalités réelles par des boutons de démonstration ou des données fictives.

---

# 1. CONTEXTE DU PROJET

Entreprise : **Green Tech Energy Cameroon (GTEC)**  
Slogan : **« Innover aujourd’hui, construire un avenir durable »**  
Téléphone : **+237 6 55 54 76 49**  
Domaines annoncés : génie électrique, génie informatique, froid et climatisation, génie civil, BTP et autres services à confirmer.

Le besoin est de numériser la gestion des demandes de service et la coordination entre clients, techniciens et administration GTEC.

Le projet doit comprendre :
1. un site public professionnel ;
2. un espace client connecté ;
3. un espace technicien connecté ;
4. un espace administrateur GTEC ;
5. un backend et une base de données réellement opérationnels.

À terme, l'architecture pourra évoluer vers une application mobile. Ne pas développer l'application mobile dans cette étape sauf instruction explicite.

---

# 2. PREMIÈRE ÉTAPE OBLIGATOIRE : AUDITER LE PROJET EXISTANT

Avant de modifier le code :

1. Inspecter les fichiers, routes, composants, styles et dépendances du projet Bolt actuel.
2. Identifier le framework, la méthode de routage, les éventuels services backend, la base de données et les formulaires existants.
3. Identifier les éléments visuels de la landing page qu'il faut conserver.
4. Vérifier si l'authentification, les données et les formulaires sont réels ou seulement simulés.
5. Établir la liste des fonctionnalités déjà opérationnelles, des fonctionnalités partielles et des éléments à créer.
6. Ne pas remplacer tout le projet par un nouveau template si l'existant peut être amélioré.

**Ne jamais prétendre qu'une fonctionnalité fonctionne si elle n'est pas reliée à un backend ou à un stockage réel.**

---

# 3. DIRECTION ARTISTIQUE : CONSERVER LE DESIGN WAOUH

La capture actuelle montre une direction visuelle vert profond, vert énergie, lignes techniques et composition moderne. Conserver cette identité et la rendre cohérente dans les espaces connectés.

## Identité visuelle
- Vert forêt : `#075B35`
- Vert profond : `#063D2A`
- Vert énergie : `#69B536`
- Ivoire technique : `#F5F7F1`
- Charbon : `#202622`
- Blanc : `#FFFFFF`

Typographies :
- **Space Grotesk** pour les titres et les éléments de marque ;
- **Manrope** pour les textes, les formulaires et les interfaces ;
- **IBM Plex Mono** uniquement pour de petits indicateurs techniques si cela apporte de la valeur.

## Principes UI/UX
- Conserver le hero existant si le rendu reste satisfaisant.
- Réutiliser la palette, les boutons, les lignes techniques et les effets déjà définis.
- Créer un Design System cohérent pour les tableaux de bord.
- Concevoir des tableaux de bord premium, mais surtout lisibles et faciles à utiliser.
- Utiliser une navigation latérale sur ordinateur et un menu adapté sur mobile.
- Créer des états visuels distincts pour les statuts : nouvelle demande, à qualifier, devis en attente, planifiée, en cours, terminée, annulée.
- Ajouter des transitions sobres, des retours au survol et des micro-interactions.
- Respecter le contraste, la navigation clavier et `prefers-reduced-motion`.
- Ne pas appliquer les animations de la landing page aux données et tableaux si cela nuit à la lisibilité.
- Ne pas surcharger le dashboard avec des graphiques décoratifs ou de fausses statistiques.

---

# 4. ARCHITECTURE GÉNÉRALE

Le projet doit être une seule application cohérente, avec des espaces séparés par rôle.

## Routes publiques proposées
- `/` : accueil
- `/services` : liste des services
- `/services/:slug` : détail d'un service
- `/realisations` : réalisations vérifiées, si disponibles
- `/a-propos` : présentation de l'entreprise
- `/contact` : coordonnées et contact
- `/demande-devis` : formulaire de demande
- `/connexion` : connexion
- `/inscription` : choix du type de compte
- `/mot-de-passe-oublie` : récupération de compte
- `/confidentialite` et `/mentions-legales` : pages légales à compléter

## Routes privées
- `/client/*` : espace client
- `/technicien/*` : espace technicien
- `/admin/*` : administration GTEC

Les routes privées doivent être protégées par le backend, pas uniquement masquées dans le front-end. Après connexion, rediriger l'utilisateur vers l'espace correspondant à son rôle. Un utilisateur ne doit jamais pouvoir accéder aux données d'un autre rôle en modifiant simplement l'URL.

---

# 5. INSCRIPTION, CONNEXION ET RÔLES

## Types de comptes
1. **Client**
2. **Technicien**
3. **Administrateur GTEC**

## Inscription client
Champs minimaux :
- nom complet ;
- téléphone ;
- e-mail ;
- mot de passe ;
- confirmation du mot de passe ;
- type : particulier ou entreprise ;
- nom de l'entreprise, facultatif ;
- acceptation des conditions et politique de confidentialité.

Après inscription :
- vérifier les champs ;
- créer le compte dans le backend ;
- enregistrer le profil ;
- ouvrir une session sécurisée ;
- rediriger vers le dashboard client.

## Inscription technicien
Le technicien doit pouvoir :
- créer un compte ;
- saisir nom, téléphone et e-mail ;
- renseigner ses domaines de compétence ;
- indiquer son expérience, sa zone d'intervention et ses disponibilités ;
- joindre les justificatifs demandés seulement si le stockage sécurisé est configuré.

Son compte commence au statut **« En attente de validation »**. Il ne doit pas recevoir de missions avant validation par GTEC. L'administration doit pouvoir accepter, refuser ou demander des compléments.

## Connexion et récupération
- connexion e-mail/mot de passe ;
- mot de passe oublié ;
- erreurs explicites sans révéler si un e-mail est enregistré ;
- déconnexion ;
- gestion sécurisée des sessions ;
- limitation des tentatives abusives ;
- validation côté serveur ;
- aucun mot de passe stocké en clair.

Ne jamais créer un faux système de connexion uniquement côté navigateur.

---

# 6. TABLEAU DE BORD CLIENT

Le dashboard client doit répondre à cinq questions : **Quelles sont mes demandes ? Où en sont-elles ? Que dois-je faire ? Quels documents dois-je consulter ? Comment contacter GTEC ?**

## Navigation client
- Vue d'ensemble
- Nouvelle demande
- Mes demandes
- Devis
- Interventions
- Documents / contrats
- Notifications
- Mon profil
- Aide et contact

Ne montrer les rubriques devis, documents ou contrats comme fonctionnelles que si les modules correspondants sont réellement développés.

## 6.1 Vue d'ensemble
Afficher :
- message de bienvenue ;
- bouton principal « Nouvelle demande de service » ;
- nombre de demandes ouvertes ;
- demandes en attente de réponse ;
- interventions planifiées ;
- demandes terminées ;
- liste des demandes récentes ;
- prochaines interventions confirmées ;
- notifications récentes ;
- raccourci vers le contact GTEC.

Les chiffres doivent être calculés à partir des données réelles du compte connecté. Ne pas utiliser de chiffres de démonstration en production.

## 6.2 Nouvelle demande de service
Créer un parcours simple, idéalement en étapes :

**Étape 1 — Choisir le service**
- génie électrique ;
- génie informatique ;
- froid et climatisation ;
- génie civil / BTP ;
- autre service confirmé par GTEC.

Les catégories doivent provenir de la base de données ou d'une configuration administrable.

**Étape 2 — Décrire le besoin**
- titre de la demande ;
- description détaillée ;
- type de prestation : dépannage, installation, maintenance, étude ou autre ;
- niveau d'urgence souhaité ;
- lieu / ville / quartier ;
- date ou période souhaitée ;
- moyen de contact préféré ;
- photos ou documents facultatifs, si le stockage est configuré.

**Étape 3 — Vérifier et envoyer**
- récapitulatif des informations ;
- bouton de confirmation ;
- indicateur d'envoi ;
- message de succès avec numéro de référence ;
- message d'erreur clair si l'envoi échoue.

Après soumission :
- enregistrer la demande dans la base ;
- associer la demande au client connecté ;
- générer une référence unique ;
- créer un événement de suivi ;
- notifier l'administration GTEC ;
- afficher la demande dans « Mes demandes ».

Ne pas attribuer automatiquement la demande à un technicien à ce stade, sauf si GTEC valide explicitement une règle de dispatch automatique. Par défaut, l'administration qualifie la demande et choisit le technicien adapté.

## 6.3 Mes demandes
Liste filtrable par statut, domaine et période. Chaque ligne ou carte affiche :
- référence ;
- date de création ;
- catégorie ;
- résumé du besoin ;
- statut actuel ;
- prochaine action éventuelle ;
- bouton « Voir le détail ».

Le détail doit afficher :
- description initiale ;
- fichiers joints autorisés ;
- historique horodaté des statuts ;
- devis associé, si disponible ;
- technicien assigné uniquement lorsque l'attribution est confirmée et que GTEC autorise sa visibilité ;
- messages ou notes visibles par le client ;
- bouton d'annulation uniquement selon les règles définies par GTEC.

## 6.4 Devis
Si le module est inclus :
- afficher les devis transmis au client ;
- détail du service, prix, taxes éventuelles et validité ;
- statut : brouillon interne, envoyé, accepté, refusé, expiré ;
- bouton pour accepter ou refuser ;
- demander une confirmation avant toute acceptation ;
- conserver l'historique des versions.

Ne pas créer de prix fictifs et ne pas considérer un clic comme une signature électronique juridiquement qualifiée.

## 6.5 Interventions
- interventions planifiées ;
- date et créneau confirmés ;
- statut ;
- compte rendu final si publié ;
- informations de contact autorisées ;
- possibilité de confirmer la réception ou de signaler un problème.

## 6.6 Notifications
- nouvelle réponse de GTEC ;
- demande qualifiée ;
- devis envoyé ;
- intervention planifiée ;
- changement de statut ;
- document disponible.

Les notifications doivent être enregistrées côté serveur. Les e-mails sont optionnels et nécessitent une configuration réelle.

## 6.7 Profil client
- modifier nom et coordonnées ;
- type de compte particulier/entreprise ;
- informations de facturation si nécessaires ;
- modifier le mot de passe ;
- gérer les préférences de notification ;
- demander la suppression ou la désactivation du compte selon les règles légales et métier.

---

# 7. TABLEAU DE BORD TECHNICIEN

Le dashboard technicien doit être centré sur **les missions assignées, le planning, la disponibilité, les comptes rendus et le profil professionnel**.

## Navigation technicien
- Vue d'ensemble
- Mes missions
- Planning
- Disponibilité
- Compétences et profil
- Rapports d'intervention
- Notifications
- Paramètres

## 7.1 Vue d'ensemble
Afficher à partir des données réelles :
- missions à examiner ;
- missions acceptées ;
- interventions à venir ;
- interventions en cours ;
- interventions terminées ;
- prochaine intervention ;
- dernières notifications ;
- état de validation du profil.

Si le profil n'est pas validé, afficher un message clair et les étapes restantes. Masquer ou désactiver les actions interdites.

## 7.2 Mes missions
Chaque mission assignée présente :
- référence ;
- domaine technique ;
- résumé du besoin ;
- zone d'intervention ;
- urgence ;
- date souhaitée ;
- statut ;
- bouton pour ouvrir les détails.

Le technicien ne doit voir que les missions qui lui sont assignées et les informations client nécessaires à l'exécution de ces missions.

Actions possibles selon le statut :
- accepter la mission ;
- décliner avec un motif ;
- demander une clarification ;
- confirmer la planification ;
- démarrer l'intervention ;
- signaler un retard ou un blocage ;
- terminer l'intervention ;
- soumettre un rapport.

Un refus ou une indisponibilité doit notifier l'administration afin qu'elle réattribue la mission. Les règles exactes de délai de réponse et de refus doivent être configurables par GTEC.

## 7.3 Détail d'une mission
Afficher :
- référence de la demande ;
- catégorie et description ;
- adresse ou zone nécessaire à l'intervention ;
- photos et pièces jointes autorisées ;
- date et créneau ;
- instructions de GTEC ;
- statut et historique ;
- bouton de contact autorisé ;
- actions disponibles selon le statut.

Ne montrer les coordonnées personnelles du client qu'aux techniciens assignés, lorsque ces données sont nécessaires à l'intervention et selon les règles de confidentialité de GTEC.

## 7.4 Planning et disponibilité
- vues jour / semaine ;
- interventions confirmées ;
- créneaux indisponibles ;
- modification de disponibilité ;
- détection des conflits de planning ;
- avertissement avant acceptation d'une mission incompatible.

Ne pas afficher un planning « temps réel » si aucune synchronisation réelle n'est mise en place.

## 7.5 Rapport d'intervention
Formulaire possible :
- statut final ;
- description du travail effectué ;
- observations ;
- pièces ou matériel utilisé, si requis ;
- photos avant/après, si le stockage sécurisé est configuré ;
- difficultés rencontrées ;
- recommandation ou suite à prévoir ;
- date et heure de soumission.

Le rapport doit être enregistré, horodaté et visible par l'administration. Le client ne voit que la version publiée ou validée par GTEC, selon le workflow retenu.

## 7.6 Profil professionnel
- photo ou avatar ;
- nom ;
- compétences ;
- expérience ;
- formations et certifications déclarées ;
- zones d'intervention ;
- disponibilités ;
- statut de validation ;
- documents à mettre à jour.

Les certifications déclarées ne doivent pas être présentées comme vérifiées avant contrôle par GTEC.

---

# 8. TABLEAU DE BORD ADMINISTRATEUR GTEC

C'est le centre de coordination de l'entreprise. Il doit permettre de gérer le processus de bout en bout.

## Navigation admin
- Vue d'ensemble
- Demandes de service
- Clients
- Techniciens
- Attribution des missions
- Planning des interventions
- Devis et documents, si inclus
- Services et compétences
- Notifications
- Rapports
- Paramètres
- Journal d'activité

## 8.1 Vue d'ensemble
Indicateurs calculés à partir des données réelles :
- demandes reçues ;
- demandes à qualifier ;
- demandes sans technicien assigné ;
- missions en cours ;
- interventions à venir ;
- interventions terminées ;
- techniciens actifs et en attente de validation ;
- délais de traitement, si les horodatages nécessaires existent.

Ajouter une liste « Actions à traiter » : nouvelles demandes, profils à valider, missions refusées, devis en attente ou conflits de planning.

## 8.2 Gestion des demandes
- liste avec recherche et filtres ;
- vue détail ;
- qualification de la demande ;
- demande d'informations complémentaires au client ;
- changement de statut avec commentaire ;
- priorité et date souhaitée ;
- assignation à un technicien ;
- réattribution si refus ou indisponibilité ;
- historique complet ;
- suivi de la personne ayant effectué chaque action.

## 8.3 Gestion des techniciens
- liste et recherche ;
- filtres par compétence, zone et statut ;
- consultation du profil ;
- vérification des documents ;
- validation, refus ou demande de complément ;
- activation / suspension ;
- gestion des compétences et zones ;
- consultation des missions attribuées ;
- indicateurs de charge calculés à partir des missions réelles.

## 8.4 Attribution des missions
Pour la première version, prévoir une **attribution contrôlée par un administrateur** :
1. consulter les compétences requises ;
2. consulter la zone d'intervention ;
3. vérifier la disponibilité et la charge ;
4. sélectionner un technicien ;
5. confirmer l'attribution ;
6. notifier le technicien ;
7. suivre son acceptation ou son refus ;
8. réattribuer si nécessaire.

Préparer le code pour un futur moteur de suggestion qui pourra recommander les techniciens selon compétence, zone, disponibilité et charge. Le moteur ne doit pas attribuer automatiquement une mission sans validation tant que GTEC n'a pas approuvé ce fonctionnement.

## 8.5 Gestion des clients
- liste et recherche ;
- détails du profil ;
- demandes et historique ;
- statut du compte ;
- assistance et désactivation selon les permissions.

## 8.6 Gestion des services
- créer / modifier / désactiver une catégorie ;
- description ;
- icône ou image ;
- compétences nécessaires ;
- statut publié / non publié.

## 8.7 Journal d'activité
Conserver les événements importants :
- connexion administrative ;
- validation d'un technicien ;
- modification d'un rôle ;
- attribution ou réattribution d'une mission ;
- changement de statut ;
- création ou mise à jour d'un devis ;
- accès ou modification de documents sensibles.

Limiter l'accès au journal aux rôles autorisés.

---

# 9. WORKFLOW MÉTIER AUTOMATISÉ

Construire un workflow explicite et testé. Statuts indicatifs à valider avec GTEC :

`Nouvelle → À qualifier → Informations complémentaires requises (optionnel) → Qualifiée → Technicien à attribuer → Assignée → Acceptée → Planifiée → En cours → Rapport soumis → Validation GTEC (si nécessaire) → Terminée → Clôturée`

Autres états possibles :
- refusée ;
- annulée ;
- en attente de devis ;
- devis envoyé ;
- devis accepté / refusé ;
- réattribution requise.

## Automatisations minimales
- création d'une référence unique à chaque demande ;
- notification admin à la réception ;
- notification technicien après attribution ;
- notification admin en cas de refus ou d'expiration du délai de réponse, si cette règle est configurée ;
- notification client aux étapes importantes ;
- horodatage des changements ;
- enregistrement de l'utilisateur à l'origine du changement ;
- détection des conflits de planning ;
- mise à jour des indicateurs de dashboard depuis les données réelles.

Les règles automatiques doivent être centralisées dans le backend. Ne pas disperser les règles métier dans les composants React.

## Pas de fausse automatisation
Ne pas :
- changer un statut uniquement dans l'interface sans enregistrer la base ;
- envoyer un faux e-mail ;
- afficher un message « notification envoyée » si aucun fournisseur n'est configuré ;
- attribuer un technicien sur la base d'une compétence non déclarée ;
- inventer des données pour remplir les graphiques.

---

# 10. BACKEND, BASE DE DONNÉES ET STACK

## Règle de choix
D'abord inspecter l'application Bolt existante et réutiliser la stack déjà installée lorsque cela est raisonnable. Ne pas réécrire tout le projet uniquement pour changer de framework.

Si le projet n'a pas encore de backend, choisir une solution réellement intégrable dans l'environnement de déploiement :
- **Option adaptée à un MVP construit dans Bolt : Supabase** pour PostgreSQL, authentification, stockage privé et fonctions serveur, à condition de configurer les règles de sécurité RLS correctement ;
- **Option backend personnalisé : NestJS + PostgreSQL + Prisma** si le projet nécessite une API métier dédiée et si l'environnement de déploiement est prévu pour l'héberger.

Ne pas implémenter les deux architectures simultanément sans raison claire. Documenter la décision choisie.

## Tables / entités indicatives
- `users` : identité, rôle et statut ;
- `client_profiles` ;
- `technician_profiles` ;
- `service_categories` ;
- `technician_skills` ;
- `service_requests` ;
- `request_attachments` ;
- `assignments` ;
- `request_status_history` ;
- `intervention_reports` ;
- `quotes` et `quote_items`, si devis inclus ;
- `contracts`, si gestion contractuelle incluse ;
- `notifications` ;
- `audit_logs`.

Chaque entité doit avoir des identifiants stables, des dates de création et de mise à jour, et des relations cohérentes. Ajouter des index utiles aux recherches et filtres. Définir les contraintes et règles de suppression.

## Sécurité obligatoire
- contrôle d'accès côté serveur ;
- permissions distinctes pour client, technicien et admin ;
- un client ne peut accéder qu'à ses propres demandes et documents ;
- un technicien ne peut accéder qu'aux missions qui lui sont assignées et aux données nécessaires ;
- seuls les admins autorisés peuvent valider les techniciens et attribuer les missions ;
- stockage privé des documents sensibles ;
- validation des données côté serveur ;
- protection contre les abus ;
- secrets et clés API dans les variables d'environnement ;
- sauvegardes et gestion des erreurs ;
- HTTPS en production.

Si Supabase est choisi, activer des politiques RLS testées pour toutes les tables contenant des données privées. Ne jamais placer la clé `service_role` dans le navigateur.

---

# 11. NOTIFICATIONS ET COMMUNICATION

Mettre en place une couche de notification abstraite afin de pouvoir ajouter des canaux ultérieurement.

Pour le MVP :
- notifications enregistrées dans la base ;
- centre de notifications dans chaque dashboard ;
- compteur de notifications non lues ;
- marquage comme lu ;
- lien vers la demande ou la mission concernée.

En option, après configuration :
- e-mails transactionnels ;
- WhatsApp Business API ;
- SMS.

Les comptes fournisseurs, les coûts et les autorisations nécessaires aux canaux externes doivent être fournis ou validés par GTEC. Les messages doivent être réellement envoyés avant d'afficher une confirmation d'envoi.

---

# 12. DOCUMENTS, DEVIS ET SIGNATURES

Ne développer que le niveau validé pour la phase en cours.

## Devis
Si inclus :
- création par l'administration ;
- lignes de prestation ;
- quantité, prix unitaire, total et devise ;
- conditions, date et durée de validité ;
- envoi au client ;
- acceptation ou refus tracé ;
- génération PDF si la génération de documents est implémentée.

## Contrats
- modèles approuvés par GTEC ;
- version et date ;
- parties concernées ;
- statut : brouillon, envoyé, accepté/signé, expiré ;
- historique de consultation et de validation ;
- téléchargement sécurisé.

Ne pas prétendre que le clic « Accepter » est une signature électronique qualifiée. Toute intégration de signature juridiquement adaptée doit être évaluée séparément.

---

# 13. TESTS D'ACCEPTATION OBLIGATOIRES

Tester au minimum les scénarios suivants :

1. Un client crée un compte et se connecte.
2. Un client envoie une demande de service.
3. La demande est réellement enregistrée en base avec une référence.
4. L'administration voit la nouvelle demande.
5. L'administration qualifie la demande et assigne un technicien validé.
6. Le technicien reçoit la mission dans son espace.
7. Un technicien non validé ne peut pas accepter de mission.
8. Le technicien accepte ou refuse une mission et le système met à jour le statut.
9. En cas de refus, l'administration est alertée pour réattribuer la mission.
10. Le technicien met à jour le statut et soumet un rapport.
11. Le client voit uniquement les informations qui lui sont destinées.
12. Un client ne peut pas lire les demandes d'un autre client en changeant l'URL.
13. Un technicien ne peut pas lire les missions d'un autre technicien.
14. Un utilisateur ne peut pas ouvrir les routes admin sans permission.
15. Les notifications affichées correspondent à des événements réels.
16. Les erreurs réseau et les champs invalides produisent des messages compréhensibles.
17. Les principales fonctions sont utilisables sur mobile et ordinateur.
18. Les CTA de la landing page mènent aux formulaires ou pages réellement opérationnels.

Créer des tests automatisés pour les règles d'accès et les workflows critiques si l'environnement le permet.

---

# 14. PLAN DE RÉALISATION RECOMMANDÉ

Développer par étapes sans perdre le design :

## Phase A — Socle fonctionnel
- audit et conservation du design existant ;
- navigation et routes ;
- authentification ;
- rôles et permissions ;
- schéma de données ;
- formulaires réels ;
- protection des routes.

## Phase B — Workflow principal
- demandes de service ;
- tableau de bord client ;
- tableau de bord technicien ;
- administration des demandes ;
- validation des techniciens ;
- attribution et réattribution ;
- historique des statuts.

## Phase C — Suivi et communication
- planning ;
- rapports d'intervention ;
- notifications internes ;
- e-mails si fournisseur configuré ;
- documents et devis selon périmètre.

## Phase D — Durcissement et livraison
- tests de sécurité ;
- tests d'accès ;
- responsive ;
- performance ;
- SEO ;
- gestion des erreurs ;
- documentation de configuration et déploiement.

Ne pas déclarer le projet terminé à la fin de la seule phase A.

---

# 15. RÉSULTAT ATTENDU

Le résultat final doit être une application cohérente :
- une landing page premium ;
- une authentification réelle ;
- trois espaces séparés par rôle ;
- des données persistantes ;
- des workflows reliés au backend ;
- une attribution des missions traçable ;
- des notifications honnêtes et opérationnelles ;
- une sécurité adaptée aux données des clients et techniciens ;
- une interface responsive, accessible et visuellement cohérente avec GTEC.

**Priorité : préserver le design waouh existant, puis le transformer en produit métier réellement fonctionnel.**

Commence par l'audit du projet existant. Ensuite, indique clairement ce qui est déjà fonctionnel, ce qui doit être ajouté, les services externes qui doivent être configurés et les éventuelles limites de l'environnement. Implémente progressivement et teste chaque flux de bout en bout. Ne te contente pas de créer des écrans statiques.
