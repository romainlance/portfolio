/* =============================================================================
   Portfolio — Romain Lance
   Bascule français / anglais.

   Le français vit dans le HTML : c'est la version servie sans JavaScript, et
   celle que lisent les moteurs de recherche. L'anglais est appliqué par-dessus
   à partir du dictionnaire ci-dessous.

   Le dictionnaire est indexé par la chaîne française elle-même, et non par des
   clés abstraites. Deux raisons : le HTML reste lisible sans attributs
   techniques partout, et une chaîne oubliée se repère immédiatement puisqu'elle
   s'affiche en français au milieu de l'anglais. Un contrôle automatisé recense
   d'ailleurs les chaînes visibles absentes du dictionnaire.

   Sommaire
   01. Dictionnaire — interface
   02. Dictionnaire — page d'accueil
   03. Dictionnaire — pages projet
   04. Attributs et titres de page
   05. Application de la langue
   06. Bouton de bascule
   ========================================================================== */

(function (root) {
  'use strict';

  /* Le CV suit la langue : le PDF ouvert au clic comme la vignette affichée.
     Chaque fichier anglais est testé une fois, indépendamment de l'autre :
     tant qu'il n'est pas déposé dans assets/, c'est la version française qui
     reste en place, plutôt qu'un lien mort ou une image cassée. */
  var CV = {
    pdf: { fr: 'assets/cv-romain-lance.pdf', en: 'assets/cv-romain-lance-en.pdf' },
    img: { fr: 'assets/cv-preview.webp',     en: 'assets/cv-preview-en.webp' }
  };

  /* 01. DICTIONNAIRE — INTERFACE
     ---------------------------------------------------------------------- */
  var UI = {
    'Aller au contenu': 'Skip to content',
    'À propos': 'About',
    'Parcours': 'Experience',
    'Projets': 'Projects',
    'Compétences': 'Skills',
    'Formation': 'Education',
    'Contact': 'Contact',
    'Tous les projets': 'All projects',
    'Voir le projet': 'View project',
    'Ouvrir le projet': 'Open the project',
    'Ouvrir le TP': 'Open the lab',
    'Lire la vidéo': 'Play the video',
    'Voir la vidéo sur YouTube': 'Watch the video on YouTube',
    'Photo précédente': 'Previous photo',
    'Photo suivante': 'Next photo',
    'Projet personnel': 'Personal project',
    'TP académique': 'Academic lab',
    'Découvrir mon parcours': 'Explore my background',
    'Me contacter': 'Get in touch',
    'Projet suivant': 'Next project',
    'Continuer sur mobile': 'Continue on mobile',
    'Ouvrir ce site sur votre téléphone': 'Open this site on your phone',
    'Ouvrir cette page sur votre téléphone': 'Open this page on your phone',
    'Scannez ce code avec l\'appareil photo de votre mobile pour y retrouver cette page.':
      'Scan this code with your phone camera to open this page there.',
    'Copier': 'Copy',
    'Copié': 'Copied',
    'Ouvrir le CV': 'Open CV',
    'Le contexte': 'Background',
    'Le déroulé': 'How it unfolded',
    'La démarche': 'The approach',
    'Le principe': 'The principle',
    'Outils & méthodes': 'Tools & methods',
    'Ce que j\'en retiens': 'What I took from it',
    'Ce que devient le robot': 'What the robot becomes',
    'Période': 'Period',
    'Équipe': 'Team',
    'Cadre': 'Setting',
    'Lieu': 'Location',
    'Mon rôle': 'My role',
    'Livrable': 'Deliverable',
    'Principe': 'Principle',
    'Recherche': 'Research',
    'Robotique mobile': 'Mobile robotics',
    'Conception & fabrication': 'Design & build',
    'Thermique': 'Thermal engineering'
  };

  /* 02. DICTIONNAIRE — PAGE D'ACCUEIL
     ---------------------------------------------------------------------- */
  var HOME = {
    'Disponible à partir de décembre 2026': 'Available from December 2026',
    'Ingénieur Junior — Mécatronique & Robotique': 'Junior Engineer — Mechatronics & Robotics',
    'Ingénieur Junior Mécatronique & Robotique — Hauts-de-France':
      'Junior Mechatronics & Robotics Engineer — Hauts-de-France',
    'Romain Lance — Ingénieur Mécatronique & Robotique':
      'Romain Lance — Mechatronics & Robotics Engineer',

    // À propos
    'Diplômé de Junia HEI en spécialité mécatronique et robotique, je travaille à la frontière de la mécanique, de l\'électronique et de la programmation.':
      'A Junia HEI graduate specialising in mechatronics and robotics, I work where mechanics, electronics and software meet.',
    'Quatre stages ont jalonné ce parcours, dans des contextes volontairement très différents : un laboratoire de recherche en robotique mobile à Montréal, un intégrateur de machines spéciales dans le Pas-de-Calais, un parc aquatique à Malte et une unité de traitement des déchets. Chacun m\'a apporté autre chose — la rigueur du travail de recherche, la réalité du chantier et de ses imprévus, le réflexe de l\'anglais au quotidien, le contact du terrain industriel.':
      'Four internships marked this path, in deliberately very different settings: a mobile-robotics research lab in Montreal, a special-machine integrator in northern France, a water park in Malta and a waste-treatment plant. Each taught me something else — the rigour of research work, the reality of a worksite and its surprises, the habit of speaking English daily, and hands-on contact with industry.',
    'Ce que j\'en retiens surtout, c\'est le goût d\'arriver dans un environnement que je ne connais pas et d\'y devenir utile vite. Côté technique, le stage chez INIT Robots m\'a mené du modèle cinématique jusqu\'à la navigation autonome sous ROS 2, pendant qu\'un projet de recherche avec le laboratoire CRIStAL me faisait creuser la modélisation dynamique et la commande prédictive.':
      'What I mostly take from it is a taste for landing in an environment I do not know and becoming useful there quickly. On the technical side, the INIT Robots internship took me from the kinematic model all the way to autonomous navigation under ROS 2, while a research project with the CRIStAL laboratory had me dig into dynamic modelling and predictive control.',
    'Je suis disponible à partir de': 'I am available from',
    'décembre 2026': 'December 2026',
    'pour un poste autour de la mécatronique et de la robotique.':
      'for a role around mechatronics and robotics.',

    // Parcours
    'Parcours professionnel': 'Professional experience',
    'Ingénieur R&D en robotique mobile': 'R&D Engineer in mobile robotics',
    'Stage de fin d\'études': 'Final-year internship',
    '— laboratoire de recherche': '— research laboratory',
    '6 mois': '6 months',
    '4 mois': '4 months',
    '2 mois': '2 months',
    '1 mois': '1 month',
    'Montréal, Canada': 'Montreal, Canada',
    'Ouverture d\'un robot agricole commercial pour en faire une plateforme de recherche pilotable sous ROS 2.':
      'Opened up a commercial agricultural robot to turn it into a research platform driven under ROS 2.',
    'Conception et implémentation du modèle cinématique commandant les actionneurs du robot.':
      'Designed and implemented the kinematic model commanding the robot actuators.',
    'Développement de l\'interface matérielle reliant l\'architecture ROS 2 au réseau CAN embarqué.':
      'Developed the hardware interface linking the ROS 2 architecture to the on-board CAN network.',
    'Mise en service du pilotage manuel, puis de la navigation autonome.':
      'Commissioned manual driving first, then autonomous navigation.',
    'Bus CAN': 'CAN bus',
    'Cinématique': 'Kinematics',
    'Navigation autonome': 'Autonomous navigation',
    'Voir le projet Dino': 'View the Dino project',

    'Assistant chef de projet': 'Assistant project manager',
    'Stage de professionnalisation': 'Professional internship',
    '— intégrateur industriel': '— industrial integrator',
    'Suivi de l\'avancement d\'un projet de conception et de fabrication de machines spéciales pour le secteur automobile.':
      'Tracked progress on a project designing and building special-purpose machines for the automotive sector.',
    'Résolution des aléas sur chantier, en lien direct avec les équipes mécanique, électrique et programmation.':
      'Resolved issues on site, working directly with the mechanical, electrical and programming teams.',
    'Gestion de projet': 'Project management',
    'Machines spéciales': 'Special-purpose machines',
    'Coordination pluridisciplinaire': 'Cross-disciplinary coordination',

    'Surveillant de baignade': 'Lifeguard',
    'Stage international': 'International internship',
    '— parc aquatique': '— water park',
    'In-Naxxar, Malte': 'In-Naxxar, Malta',
    'Sécurité des visiteurs assurée au sein d\'une équipe et d\'une clientèle internationales.':
      'Ensured visitor safety within an international team and clientele.',
    'Environnement international': 'International environment',
    'Vigilance & sécurité': 'Vigilance & safety',

    'Traitement des déchets et méthanisation': 'Waste treatment and biogas production',
    'Stage ouvrier': 'Blue-collar internship',
    '— collecte de déchets': '— waste collection',
    'Réception et nettoyage des bacs de déchets organiques sur une unité de traitement.':
      'Received and cleaned organic-waste containers at a treatment plant.',
    'Milieu industriel': 'Industrial environment',
    'Méthanisation': 'Biogas production',

    // Projets — cartes
    'Projets d\'ingénierie': 'Engineering projects',
    'Équipe de 4': 'Team of 4',
    'Équipe de 6': 'Team of 6',
    'Équipe de 10': 'Team of 10',
    'Dino — plateforme de recherche ROS 2': 'Dino — a ROS 2 research platform',
    'Stage de fin d\'études — INIT Robots, Montréal': 'Final-year internship — INIT Robots, Montreal',
    'Rétro-ingénierie du bus CAN d\'un robot de désherbage Naïo, puis reconstruction d\'une chaîne de commande ROS 2 complète — sans toucher à ses sécurités.':
      'Reverse-engineering the CAN bus of a Naïo weeding robot, then rebuilding a complete ROS 2 control chain — without touching its safety systems.',
    'Modèle dynamique d\'un fauteuil roulant intelligent': 'Dynamic model of a smart wheelchair',
    'Projet de recherche Junia HEI × laboratoire CRIStAL': 'Research project — Junia HEI × CRIStAL laboratory',
    'Estimer en temps réel les perturbations qui écartent un fauteuil roulant de sa trajectoire — roues folles comprises — pour les compenser avant qu\'elles n\'agissent.':
      'Estimating in real time the disturbances that push a wheelchair off its path — caster wheels included — in order to cancel them before they act.',
    'Robot agricole autonome type rover': 'Autonomous agricultural rover',
    'Projet de mécatronique et robotique — Junia HEI': 'Mechatronics and robotics project — Junia HEI',
    'D\'un cahier des charges chiffré à une machine assemblée : conception mécanique, électronique embarquée et pilotage d\'une équipe de six.':
      'From a quantified specification to an assembled machine: mechanical design, embedded electronics and leading a team of six.',
    'Frigo du désert': 'Desert fridge',
    'Projet PISTE — Junia HEI': 'PISTE project — Junia HEI',
    'Conserver des aliments au frais sans électricité : un réfrigérateur par évaporation, sans moteur ni fluide frigorigène.':
      'Keeping food cool without electricity: an evaporative fridge, with no motor and no refrigerant.',
    'Conception mécanique': 'Mechanical design',
    'Modélisation dynamique': 'Dynamic modelling',
    'Commande prédictive': 'Predictive control',
    'Modélisation': 'Modelling',
    'Conception': 'Design',

    // Projets personnels et TP académiques
    'Projets personnels': 'Personal projects',
    'TP académiques': 'Academic labs',
    'Perso': 'Personal',
    'TP': 'Labs',
    'Ce que je démonte, conçois et fabrique en dehors des cours. Chaque carte ouvre son album photo.':
      'What I take apart, design and build outside class. Each card opens its photo album.',
    'Les travaux pratiques du cursus, sur du matériel industriel réel.':
      'The hands-on labs of the course, on real industrial hardware.',

    'Vélo électrique': 'Electric bike',
    'Motorisation d\'un vélo : la roue arrière laisse place à une roue à moyeu moteur, montée sur un châssis fabriqué sur mesure.':
      'Motorising a bicycle: the rear wheel gives way to a hub-motor wheel, mounted on a purpose-built frame.',
    'Motoriser un vélo sans repartir d\'une base neuve : le train arrière d\'origine est déposé, remplacé par une roue à moyeu moteur montée sur un châssis fabriqué sur mesure et boulonné au cadre.':
      'Motorising a bicycle without starting from a new base: the original rear end comes off, replaced by a hub-motor wheel on a purpose-built frame bolted to the bicycle.',
    'La batterie et le contrôleur prennent place sur ce même châssis, protégés par un boîtier dessiné et imprimé pour l\'occasion.':
      'The battery and the controller sit on that same frame, protected by an enclosure drawn and printed for the purpose.',
    'Le vélo complet : la roue arrière d\'origine a laissé place à un ensemble motorisé monté sur un châssis rapporté.':
      'The complete bicycle: the original rear wheel has given way to a powered assembly on an add-on frame.',
    'Détail du train arrière : châssis soudé, roue à moyeu moteur, batterie et faisceau électrique.':
      'Close-up of the rear end: welded frame, hub-motor wheel, battery and wiring loom.',
    'Le boîtier du contrôleur, dessiné et imprimé en 3D, ajouré pour laisser passer l\'air.':
      'The controller enclosure, drawn and 3D-printed, vented to let the air through.',
    'Le vélo motorisé, vu de profil': 'The motorised bicycle, seen from the side',
    'Gros plan du train arrière motorisé': 'Close-up of the powered rear end',
    'Boîtier imprimé en 3D protégeant le contrôleur': '3D-printed enclosure protecting the controller',
    'Motorisation': 'Motorisation',

    'Hack de hoverboard': 'Hoverboard hack',
    'Ouverture d\'un hoverboard du commerce pour accéder à sa carte de commande et la reprogrammer.':
      'Opening up a consumer hoverboard to reach its control board and reprogram it.',
    'Un hoverboard du commerce est une plateforme fermée, mais son électronique est générique : deux moteurs sans balais, deux étages de puissance et un microcontrôleur bien connu.':
      'A consumer hoverboard is a closed platform, but its electronics are generic: two brushless motors, two power stages and a well-known microcontroller.',
    'L\'ouvrir permet d\'identifier ce microcontrôleur, de retrouver son port de programmation et d\'y brancher une sonde — première étape pour remplacer le logiciel d\'origine et réutiliser la motorisation ailleurs.':
      'Opening it up means identifying that microcontroller, finding its programming port and hooking up a probe — the first step towards replacing the original firmware and reusing the drive elsewhere.',
    'La carte de commande d\'origine, une fois le hoverboard ouvert : deux étages de puissance, un par moteur de roue.':
      'The original control board, once the hoverboard is open: two power stages, one per wheel motor.',
    'Le microcontrôleur qui pilote l\'ensemble : un STM32F103RCT6, cœur ARM Cortex-M3.':
      'The microcontroller driving the whole thing: an STM32F103RCT6, ARM Cortex-M3 core.',
    'Programmation par sonde ST-LINK V2, branchée sur le port SWD de la carte.':
      'Programming through an ST-LINK V2 probe, connected to the board\'s SWD port.',
    'Carte de commande du hoverboard, une fois l\'appareil ouvert':
      'The hoverboard control board, once the device is open',
    'Gros plan du microcontrôleur STM32F103': 'Close-up of the STM32F103 microcontroller',
    'Sonde ST-LINK V2 branchée sur le port de programmation':
      'ST-LINK V2 probe connected to the programming port',
    'Électronique de puissance': 'Power electronics',

    'Modélisme — coque de bateau': 'Model making — boat hull',
    'Une coque dessinée sous Fusion 360, découpée en tronçons imprimables et assemblés par emboîtement.':
      'A hull drawn in Fusion 360, cut into printable sections that slot together.',
    'Une coque dépasse largement le volume d\'une imprimante de bureau. Elle est donc dessinée d\'un seul tenant, puis recoupée en tronçons, chacun muni d\'un emboîtement qui garantit l\'alignement à l\'assemblage.':
      'A hull is far larger than a desktop printer\'s build volume. It is therefore drawn in one piece, then cut into sections, each carrying a joint that guarantees alignment at assembly.',
    'Le pont reste amovible pour laisser l\'accès à l\'intérieur.':
      'The deck stays removable to keep the inside accessible.',
    'La coque et son pont amovible, modélisés sous Fusion 360 et découpés en tronçons compatibles avec le volume d\'impression.':
      'The hull and its removable deck, modelled in Fusion 360 and cut into sections that fit the build volume.',
    'Détail de la liaison entre deux tronçons : l\'emboîtement assure l\'alignement au moment du collage.':
      'Close-up of the joint between two sections: it holds the alignment while the glue sets.',
    'Coque de bateau modélisée sous Fusion 360': 'Boat hull modelled in Fusion 360',
    'Détail de l\'emboîtement entre deux tronçons de coque':
      'Close-up of the joint between two hull sections',

    'Automates programmables': 'Programmable logic controllers',
    'Programmation et mise en service sur trois familles d\'automates industriels, Schneider et Siemens.':
      'Programming and commissioning across three families of industrial controllers, Schneider and Siemens.',
    'Trois familles d\'automates, trois générations : le Modicon M340 et le TSX Premium de Schneider, le SIMATIC S7-300 de Siemens. Chaque platine est câblée, adressée et raccordée au réseau Ethernet de la salle.':
      'Three families of controllers, three generations: Schneider\'s Modicon M340 and TSX Premium, Siemens\' SIMATIC S7-300. Each rack is wired, addressed and connected to the room\'s Ethernet network.',
    'Le travail va du repérage des entrées et sorties jusqu\'à la mise en service du programme sur la partie opérative.':
      'The work runs from labelling the inputs and outputs through to commissioning the program on the machine itself.',
    'Schneider Modicon M340 : alimentation CPS 2000, processeur à port Ethernet, module de 16 entrées TOR 24 V (DDI 1602) et module de 16 sorties à relais (DRA 1605).':
      'Schneider Modicon M340: CPS 2000 power supply, processor with Ethernet port, 16-channel 24 V digital input module (DDI 1602) and 16-channel relay output module (DRA 1605).',
    'Siemens SIMATIC S7-300 : alimentation PS 307, CPU 315-2 PN/DP et module mixte 16 entrées / 16 sorties, repéré au nom des capteurs et des actionneurs.':
      'Siemens SIMATIC S7-300: PS 307 power supply, CPU 315-2 PN/DP and a combined 16-input / 16-output module, labelled with the names of the sensors and actuators.',
    'Schneider Modicon TSX Premium : alimentation TSX PSY 2600, processeur TSX P57 2634, modules d\'entrées TSX DEY 16D2 et de sorties à relais TSX DSY 16R5.':
      'Schneider Modicon TSX Premium: TSX PSY 2600 power supply, TSX P57 2634 processor, TSX DEY 16D2 input modules and TSX DSY 16R5 relay output modules.',
    'Automate Schneider Modicon M340 et ses modules': 'Schneider Modicon M340 controller and its modules',
    'Automate Siemens SIMATIC S7-300': 'Siemens SIMATIC S7-300 controller',
    'Automate Schneider Modicon TSX Premium': 'Schneider Modicon TSX Premium controller',
    'Entrées/sorties TOR': 'Digital I/O',

    'Programmation d\'un robot mobile omnidirectionnel Festo dans l\'environnement graphique Robotino View.':
      'Programming a Festo omnidirectional mobile robot in the Robotino View graphical environment.',
    'Le Robotino de Festo est un robot mobile à trois roues omnidirectionnelles : aucune direction à braquer, le déplacement naît de la combinaison des trois vitesses de roue.':
      'Festo\'s Robotino is a mobile robot on three omnidirectional wheels: nothing to steer — motion comes from combining the three wheel speeds.',
    'La programmation se fait par blocs sous Robotino View, en reliant capteurs, calculs et consignes moteur — le robot exécute le diagramme tel qu\'il est dessiné.':
      'Programming is done with blocks in Robotino View, wiring sensors, computations and motor setpoints together — the robot runs the diagram exactly as drawn.',
    'Le programme sous Robotino View : un diagramme de blocs relie les consignes des trois moteurs, l\'entraînement omnidirectionnel, la détection de collision et les entrées/sorties du robot.':
      'The program in Robotino View: a block diagram wires together the three motor setpoints, the omnidirectional drive, collision detection and the robot\'s inputs and outputs.',
    'Programme du Robotino dans l\'environnement Robotino View':
      'The Robotino program in the Robotino View environment',
    'Robot omnidirectionnel': 'Omnidirectional robot',
    '1 photo · 1 vidéo': '1 photo · 1 video',
    'Le robot en déplacement, piloté par le programme ci-contre.':
      'The robot on the move, driven by the program shown alongside.',
    'Roue folle du fauteuil roulant, montée sur sa fourche pivotante':
      'Caster wheel of the wheelchair, mounted on its swivelling fork',
    'L\'enceinte du frigo du désert en cours d\'impression 3D':
      'The desert fridge enclosure being 3D-printed',
    'Programmation par blocs': 'Block programming',

    // Photo du stage Industeam, dans le parcours
    'Sur le chantier': 'On site',
    'Agrandir la photo de l\'atelier': 'Enlarge the workshop photo',
    'Industeam — machines spéciales': 'Industeam — special-purpose machines',
    'Une machine spéciale est conçue pour une pièce et une seule : le bras qui la manipule, l\'outil qui l\'assemble et le convoyeur qui l\'amène sont dimensionnés pour ce produit précis.':
      'A special-purpose machine is designed for one part and one part only: the arm that handles it, the tool that assembles it and the conveyor that brings it are all sized for that exact product.',
    'C\'est au montage que se révèlent les écarts entre le plan et le réel — et c\'est là que se joue l\'essentiel du suivi de chantier.':
      'It is during assembly that the gaps between drawing and reality show up — and that is where most of the on-site follow-up happens.',
    'Une cellule en cours de montage : bras six axes FANUC et broche de vissage automatique montée sur son axe vertical.':
      'A cell under assembly: a six-axis FANUC arm and an automatic screwdriving spindle on its vertical axis.',
    'Cellule robotisée en cours de montage : bras FANUC et broche de vissage':
      'Robotic cell under assembly: FANUC arm and screwdriving spindle',
    'Robotique industrielle': 'Industrial robotics',
    'Vissage automatique': 'Automatic screwdriving',
    'Secteur automobile': 'Automotive sector',

    // Compétences
    'Robotique': 'Robotics',
    'Mécanique': 'Mechanical engineering',
    'Électronique & embarqué': 'Electronics & embedded',
    'Programmation': 'Programming',
    'Langues': 'Languages',
    'Savoir-être': 'Soft skills',
    'Localisation': 'Localisation',
    'Asservissement PID': 'PID control',
    'Boucle ouverte / fermée': 'Open / closed loop',
    'Dynamique': 'Dynamics',
    'Modèle géométrique direct / inverse': 'Forward / inverse geometric model',
    'Statique': 'Statics',
    'Résistance des matériaux': 'Strength of materials',
    'Impression 3D (FDM/PLA)': '3D printing (FDM/PLA)',
    'Usinage simple': 'Basic machining',
    'Montage mécanique': 'Mechanical assembly',
    'Conception PCB': 'PCB design',
    'Git / versionning': 'Git / version control',
    'Français': 'French',
    'Anglais': 'English',
    'Langue maternelle': 'Native language',
    'Rigueur': 'Rigour',
    'Autonomie': 'Autonomy',
    'Capacité d\'adaptation': 'Adaptability',
    'Réactivité': 'Responsiveness',
    'Centres d\'intérêt': 'Interests',
    'Sport': 'Sport',
    'Bricolage': 'Tinkering',
    'Football en club': 'Club football',
    'Tennis': 'Tennis',
    'Musculation': 'Strength training',
    'Running': 'Running',
    'CAO': 'CAD',
    'Impression 3D': '3D printing',
    'Électronique': 'Electronics',

    // Formation
    'Diplôme d\'ingénieur': 'Engineering degree',
    'Classe préparatoire': 'Preparatory class',
    'Ingénieur généraliste — spécialité Mécatronique et Robotique':
      'General engineering degree — Mechatronics and Robotics specialisation',
    'Junia HEI, École des Hautes Études d\'Ingénieur': 'Junia HEI, École des Hautes Études d\'Ingénieur',
    'MPSI — mathématiques, physique et sciences de l\'ingénieur':
      'MPSI — mathematics, physics and engineering science',

    // Contact
    'Mon profil vous intéresse ? N\'hésitez pas à me contacter, je serai ravi d\'échanger avec vous !':
      'Does my profile interest you? Feel free to get in touch — I would be glad to talk.',
    'E-mail': 'Email',
    'Localisation ': 'Location ',
    'Mobilité': 'Mobility',
    'Disponibilité': 'Availability',
    'Saint-Martin-Choquel (62), France': 'Saint-Martin-Choquel (62), France',
    'Permis B — véhicule personnel': 'Full driving licence — own vehicle',
    'À partir de décembre 2026': 'From December 2026',
    'Votre nom': 'Your name',
    'Objet': 'Subject',
    'Message': 'Message',
    'Ouvrir dans ma messagerie': 'Open in my mail app',
    'Aucun serveur : ce formulaire prépare l\'e-mail dans votre application habituelle, via une nouvelle fenêtre.':
      'No server involved: this form simply drafts the email in your usual app, in a new window.',
    'Merci de compléter les trois champs avant d\'envoyer.':
      'Please fill in all three fields before sending.'
  };

  /* 03. DICTIONNAIRE — PAGES PROJET
     ---------------------------------------------------------------------- */
  var PROJECTS = {
    'Projet 01': 'Project 01',
    'Projet 02': 'Project 02',
    'Projet 03': 'Project 03',
    'Projet 04': 'Project 04',
    '2026 · 6 mois': '2026 · 6 months',
    '4 étudiants': '4 students',
    '6 étudiants': '6 students',
    '10 étudiants': '10 students',
    'Article scientifique + rapport': 'Scientific paper + report',
    'Stage de fin d\'études — INIT Robots': 'Final-year internship — INIT Robots',
    'Junia HEI × laboratoire CRIStAL': 'Junia HEI × CRIStAL laboratory',
    'Pilotage du projet, cahier des charges, commande moteurs':
      'Project leadership, specification, motor control',
    'Refroidissement passif par évaporation': 'Passive evaporative cooling',

    // Dino
    'Dino — plateforme': 'Dino — a ROS 2',
    'de recherche ROS 2': 'research platform',
    'Le Dino de Naïo Technologies est une plateforme de désherbage commerciale, fermée. Tout l\'enjeu : reconstituer son fonctionnement pour le rouvrir en robot de recherche programmable, sans toucher à ses sécurités d\'origine.':
      'Naïo Technologies\' Dino is a closed, commercial weeding platform. The whole challenge: reconstruct how it works in order to reopen it as a programmable research robot, without touching its original safety systems.',
    'Nœuds ROS 2, passerelle et réseau CAN — représentation schématique':
      'ROS 2 nodes, gateway and CAN network — schematic view',
    'Stage de fin d\'études de six mois au laboratoire INIT Robots, à Montréal, mené avec l\'appui d\'un technicien du laboratoire pour l\'intégration matérielle et d\'un doctorant en robotique agricole et navigation autonome.':
      'A six-month final-year internship at the INIT Robots laboratory in Montreal, carried out with the support of a lab technician for hardware integration and of a PhD student in agricultural robotics and autonomous navigation.',
    'Le': 'The',
    'Dino': 'Dino',
    'est un robot de désherbage mécanique conçu par Naïo Technologies. Comme beaucoup de systèmes industriels, c\'est une plateforme fermée : son architecture interne, ses protocoles et ses méthodes de commande ne sont pas documentés pour être modifiés de l\'extérieur.':
      'is a mechanical weeding robot built by Naïo Technologies. Like many industrial systems, it is a closed platform: its internal architecture, protocols and control methods are not documented for outside modification.',
    'L\'objectif est de conserver toute la mécanique et l\'électromécanique existantes — qui fonctionnent — et de remplacer la seule couche de commande propriétaire par une architecture ROS 2 ouverte. Une contrainte structure tout le projet :':
      'The goal is to keep all the existing mechanics and electromechanics — which work — and to replace only the proprietary control layer with an open ROS 2 architecture. One constraint shapes the entire project:',
    'l\'automate de sécurité doit rester indépendant du nouveau logiciel':
      'the safety controller must remain independent of the new software',
    '. L\'ordinateur de bord peut demander un mouvement, jamais empêcher l\'automate de couper l\'alimentation.':
      '. The on-board computer may request a movement, never prevent the controller from cutting power.',
    'Traction': 'Traction',
    'Direction': 'Steering',
    'Perception': 'Sensing',
    'Sécurité': 'Safety',
    '4 roues motrices indépendantes, moteurs à courant continu et freins électromagnétiques':
      '4 independently driven wheels, DC motors and electromagnetic brakes',
    '4 actionneurs linéaires — soit 8 articulations commandées au total':
      '4 linear actuators — 8 controlled joints in total',
    '2 Lidars, GPS, centrale inertielle, retours de position et de vitesse des actionneurs':
      '2 lidars, GPS, inertial measurement unit, position and speed feedback from the actuators',
    'Automate dédié : arrêts d\'urgence, bumpers, réarmement, sélecteur à clé, état des freins':
      'Dedicated safety controller: emergency stops, bumpers, reset, key switch, brake states',
    'Rétro-ingénierie du bus CAN': 'Reverse-engineering the CAN bus',
    'Partir du système fini pour en reconstruire l\'architecture : schémas électriques, nomenclature, observation du robot, puis écoute du réseau au CAN-sniffer. Comparer les trames à l\'arrêt et en mouvement, envoyer des commandes contrôlées, observer la réaction, recouper avec les mesures physiques.':
      'Starting from the finished system to rebuild its architecture: wiring diagrams, parts list, observation of the robot, then listening to the network with a CAN sniffer. Comparing frames at standstill and in motion, sending controlled commands, watching the reaction, cross-checking against physical measurements.',
    'Rédaction de l\'ICD': 'Writing the ICD',
    'Se brancher sur le bus ne suffit pas : encore faut-il comprendre chaque message. L\'':
      'Plugging into the bus is not enough — each message still has to be understood. The ',
    'consigne, pour chaque trame, l\'identifiant, l\'émetteur, la longueur, la fréquence, la signification de chaque octet, le facteur d\'échelle, l\'unité et les codes d\'erreur. C\'est ce document qui rend le réseau propriétaire exploitable.':
      ' records, for every frame, the identifier, the sender, the length, the rate, the meaning of each byte, the scaling factor, the unit and the error codes. That document is what makes the proprietary network usable.',
    'Passerelle ROS 2 ↔ CAN': 'ROS 2 ↔ CAN gateway',
    'Un nouvel ordinateur de bord sous ROS 2 est relié au bus principal via une interface USB-CAN, déployée sur un Raspberry Pi dédié. La passerelle ne décide rien : elle traduit, dans les deux sens, entre le monde informatique et le réseau temps réel du robot.':
      'A new on-board computer running ROS 2 is connected to the main bus through a USB-CAN interface, deployed on a dedicated Raspberry Pi. The gateway decides nothing: it translates, in both directions, between the computing world and the robot\'s real-time network.',
    'Couche d\'abstraction': 'Abstraction layer',
    'Aucun nœud ROS 2 n\'envoie d\'octets CAN directement. Le contrôleur raisonne en grandeurs physiques — une vitesse en rad/s, un angle en degrés — et un driver unique se charge de la conversion. L\'ICD reste ainsi centralisé dans un seul paquet, et le passage de la simulation au robot réel ne change qu\'une brique.':
      'No ROS 2 node sends CAN bytes directly. The controller reasons in physical quantities — a speed in rad/s, an angle in degrees — and a single driver handles the conversion. The ICD therefore stays centralised in one package, and moving from simulation to the real robot changes only one building block.',
    'Contrôleur cinématique 4WD–4WS': '4WD–4WS kinematic controller',
    'Le Dino n\'est pas un robot différentiel : chaque roue a sa vitesse et son angle propres. Une consigne (v':
      'The Dino is not a differential robot: each wheel has its own speed and angle. A command (v',
    ', ω) doit devenir huit consignes — quatre vitesses de roue et quatre angles de direction. Ce contrôleur ouvre trois modes de déplacement : opposé, crabe et pivot.':
      ', ω) must become eight setpoints — four wheel speeds and four steering angles. This controller opens up three driving modes: opposite, crab and pivot.',
    'Jumeau numérique sous Gazebo': 'Digital twin in Gazebo',
    'Avant tout essai réel, une simulation reprenant le modèle mécanique, les huit articulations, les masses et inerties, les collisions et les capteurs. Elle sert à vérifier ce qui coûte cher à découvrir sur le terrain : signe des vitesses, sens de rotation, conventions d\'angle, limites articulaires.':
      'Before any real trial, a simulation carrying the mechanical model, the eight joints, masses and inertias, collisions and sensors. It checks what is expensive to discover in the field: sign of the velocities, direction of rotation, angle conventions, joint limits.',
    'Téléopération, GPS et arrêt d\'urgence sans fil': 'Teleoperation, GPS and wireless emergency stop',
    'Pilotage manuel à la manette Bluetooth pour les phases de test et de calibration, intégration du GPS pour le suivi de trajectoire en extérieur, et conception d\'un arrêt d\'urgence sans fil pour sécuriser les essais. Tant qu\'on ne sait pas conduire la machine à la main, on ne peut pas juger ce qu\'un algorithme fait à sa place.':
      'Manual driving with a Bluetooth gamepad for testing and calibration, GPS integration for outdoor path following, and the design of a wireless emergency stop to make trials safe. Until you can drive the machine by hand, you cannot judge what an algorithm does in your place.',
    'Barrière logicielle': 'Software guard',
    'Avant émission, chaque commande passe par les limites cinématiques, l\'état des dispositifs de sécurité, puis les bornes de vitesse, de courant et de position. Elle n\'est convertie en trame CAN que si toutes les conditions sont réunies — les protections matérielles d\'origine restant, elles, intactes et prioritaires.':
      'Before transmission, every command goes through the kinematic limits, the state of the safety devices, then the speed, current and position bounds. It is turned into a CAN frame only when all conditions hold — the original hardware protections remaining untouched and taking precedence.',
    'Au terme du projet, le Dino n\'est plus seulement un robot de désherbage : c\'est une plateforme expérimentale dotée d\'un ordinateur de bord moderne, d\'une architecture ROS 2 modulaire, d\'une interface CAN documentée, d\'un contrôleur 4WD–4WS, d\'un jumeau numérique et d\'une navigation autonome.':
      'By the end of the project, the Dino is no longer just a weeding robot: it is an experimental platform with a modern on-board computer, a modular ROS 2 architecture, a documented CAN interface, a 4WD–4WS controller, a digital twin and autonomous navigation.',
    'L\'intérêt de la démarche tient en une phrase : réutiliser une base mécanique industrielle déjà éprouvée, et ne remplacer que ce qui limitait son usage — le logiciel.':
      'The value of the approach fits in one sentence: reuse a proven industrial mechanical base, and replace only what limited its use — the software.',
    'Le Dino en mouvement, piloté par la chaîne de commande ROS 2.':
      'The Dino in motion, driven by the ROS 2 control chain.',
    'Localisation GPS–IMU–Lidar': 'GPS–IMU–lidar localisation',
    'Contrôle 4 roues directrices': 'Four-wheel steering control',
    'Diagnostic': 'Diagnostics',
    'Nœuds & topics': 'Nodes & topics',
    'Cinématique 4WD–4WS': '4WD–4WS kinematics',
    'Téléopération': 'Teleoperation',
    'Embarqué': 'Embedded',
    'Méthode': 'Method',
    'Rétro-ingénierie': 'Reverse engineering',
    'Sécurité fonctionnelle': 'Functional safety',

    // Fauteuil roulant
    // Le titre est coupé en deux lignes dans le HTML : chaque moitié se
    // traduit séparément, et la coupure se fait ailleurs en anglais.
    'Modèle dynamique d\'un': 'Dynamic model of a',
    'fauteuil roulant intelligent': 'smart wheelchair',
    'Faire suivre une trajectoire à un fauteuil roulant intelligent malgré tout ce qui l\'en écarte — frottements, incertitudes, roues folles. Non pas en corrigeant l\'écart après coup, mais en estimant la perturbation pour la compenser à l\'avance.':
      'Making a smart wheelchair follow a path despite everything pushing it off course — friction, uncertainties, caster wheels. Not by correcting the error after the fact, but by estimating the disturbance to cancel it in advance.',
    'Réponse dynamique amortie — représentation schématique': 'Damped dynamic response — schematic view',
    'Projet de recherche et innovation mené à Junia HEI avec le laboratoire CRIStAL, en équipe de quatre étudiants, sur 2025 et 2026, sous l\'encadrement de M. Meziane Larbi et M. Gilles Tagne.':
      'A research and innovation project run at Junia HEI with the CRIStAL laboratory, in a team of four students, across 2025 and 2026, supervised by Mr Meziane Larbi and Mr Gilles Tagne.',
    'Le fauteuil roulant intelligent étudié repose sur': 'The smart wheelchair studied rests on',
    'deux roues motrices': 'two driven wheels',
    'et': 'and',
    'deux roues folles': 'two caster wheels',
    'qui assurent son équilibre. Ces dernières réagissent au mouvement au lieu de le produire : elles pivotent librement, introduisent des efforts de contact difficiles à décrire, et pèsent pourtant sur la stabilité et la maniabilité de l\'ensemble.':
      'that keep it balanced. The latter react to movement instead of producing it: they swivel freely, introduce contact forces that are hard to describe, and yet weigh on the stability and handling of the whole.',
    'L\'objectif est double : construire un jumeau numérique fidèle du fauteuil, puis en tirer une loi de commande capable d\'assurer un suivi de trajectoire précis et stable face aux perturbations — un enjeu de sécurité autant que de confort pour une application d\'assistance à la mobilité.':
      'The goal is twofold: build a faithful digital twin of the wheelchair, then derive from it a control law able to deliver accurate, stable path following in the face of disturbances — a matter of safety as much as comfort for a mobility-assistance application.',
    'État de l\'art': 'State of the art',
    'Analyse bibliographique des modèles dynamiques déjà publiés sur ce type de système, pour partir de bases établies plutôt que d\'une page blanche.':
      'A literature review of dynamic models already published for this kind of system, so as to start from established ground rather than a blank page.',
    'Modèle cinématique différentiel': 'Differential kinematic model',
    'Un premier modèle non holonomique limité aux deux roues motrices, reliant leurs vitesses à la vitesse linéaire et angulaire du châssis. Utile, mais trop pauvre pour commander le fauteuil avec précision — d\'où la suite.':
      'A first non-holonomic model limited to the two driven wheels, relating their speeds to the linear and angular velocity of the chassis. Useful, but too coarse to control the chair precisely — hence what follows.',
    'Modèle dynamique, puis roues folles': 'Dynamic model, then caster wheels',
    'Le modèle dynamique est d\'abord établi sans les roues folles, puis étendu pour les intégrer : efforts de contact au sol, effets d\'inertie, réactions traitées par multiplicateurs de Lagrange. C\'est cette extension qui rapproche réellement la simulation du comportement observé.':
      'The dynamic model is first established without the caster wheels, then extended to include them: ground contact forces, inertial effects, reactions handled through Lagrange multipliers. That extension is what genuinely brings the simulation closer to observed behaviour.',
    'Observateur de perturbations (NESO)': 'Disturbance observer (NESO)',
    'Plutôt que de tenter de modéliser chaque frottement, un observateur non linéaire étendu estime en temps réel la':
      'Rather than trying to model every friction term, a nonlinear extended state observer estimates in real time the',
    'perturbation globale': 'total disturbance',
    'agissant sur le système — frottements, incertitudes de paramètres, influence des roues folles.':
      'acting on the system — friction, parameter uncertainty, influence of the caster wheels.',
    'Commande hiérarchique : MPC bas niveau, LQR haut niveau':
      'Hierarchical control: MPC at low level, LQR at high level',
    'Au niveau bas, un contrôleur à modèle prédictif régule la dynamique des moteurs à courant continu. Au niveau haut, un régulateur optimal LQR couplé au même observateur minimise les erreurs longitudinale, latérale et d\'orientation. La perturbation estimée est compensée avant qu\'elle ne dévie la trajectoire.':
      'At the low level, a model predictive controller regulates the dynamics of the DC motors. At the high level, an optimal LQR regulator coupled to the same observer minimises longitudinal, lateral and heading errors. The estimated disturbance is cancelled before it can bend the trajectory.',
    'Simulation, puis validation sur plateforme': 'Simulation, then validation on a platform',
    'L\'ensemble est simulé sous MATLAB/Simulink, puis validé sur la plateforme Quanser. Les résultats montrent que l\'estimation active des perturbations suffit à garantir un suivi stable et précis, y compris en présence d\'incertitudes.':
      'The whole is simulated in MATLAB/Simulink, then validated on the Quanser platform. Results show that active disturbance estimation is enough to guarantee stable, accurate tracking, uncertainties included.',
    'Rédaction scientifique': 'Scientific writing',
    'Le travail a donné lieu à un rapport complet et à un article scientifique formalisant la démarche, les modèles et les résultats.':
      'The work produced a full report and a scientific paper formalising the approach, the models and the results.',
    'Une roue folle et sa fourche pivotante : rien ne l\'entraîne, elle s\'oriente d\'elle-même en fonction du mouvement du fauteuil.':
      'A caster wheel and its swivelling fork: nothing drives it — it turns by itself according to how the chair moves.',
    'À côté, la roue motrice. C\'est l\'interaction entre les deux qui rend la dynamique du fauteuil difficile à décrire.':
      'Next to it, the driven wheel. It is the interaction between the two that makes the chair\'s dynamics hard to describe.',
    'Roue folle avant du fauteuil, montée sur sa fourche pivotante':
      'Front caster wheel of the chair, mounted on its swivelling fork',
    'Roue folle et roue motrice du fauteuil, vues de trois quarts':
      'Caster wheel and driven wheel of the chair, seen at three-quarters',
    'Le fauteuil en essai, sur la plateforme du laboratoire.':
      'The chair under test, on the laboratory platform.',
    'Le prototype assemblé, châssis et carters imprimés en 3D.':
      'The assembled prototype, chassis and covers 3D-printed.',
    'Le modèle SolidWorks dont sont issues les pièces imprimées.':
      'The SolidWorks model the printed parts came from.',
    'Vue éclatée : batterie, cartes, télémètre laser et ensembles moteur-roue.':
      'Exploded view: battery, boards, laser rangefinder and wheel-motor assemblies.',
    'Le rover assemblé, posé sur un plan de travail': 'The assembled rover on a workbench',
    'Le rover modélisé sous SolidWorks': 'The rover modelled in SolidWorks',
    'Vue éclatée des composants du rover': 'Exploded view of the rover components',
    'Le Dino dans son usage d\'origine : désherbage mécanique entre les rangs.':
      'The Dino in its original use: mechanical weeding between the rows.',
    'Photo : Naïo Technologies': 'Photo: Naïo Technologies',
    'Image d\'illustration : Naïo Technologies': 'Illustration image: Naïo Technologies',
    'Le Dino de Naïo Technologies au travail dans un champ de salades':
      'Naïo Technologies\' Dino at work in a lettuce field',
    'Le prototype imprimé du frigo du désert': 'The printed prototype of the desert fridge',
    'Le rover agricole modélisé sous SolidWorks': 'The agricultural rover modelled in SolidWorks',
    'Cinématique différentielle': 'Differential kinematics',
    'Roues folles': 'Caster wheels',
    'Multiplicateurs de Lagrange': 'Lagrange multipliers',
    'Jumeau numérique': 'Digital twin',
    'Automatique': 'Control engineering',
    'Commande prédictive (MPC)': 'Model predictive control (MPC)',
    'Observateur NESO': 'NESO observer',
    'Rejet de perturbations': 'Disturbance rejection',
    'Suivi de trajectoire': 'Path following',
    'Validation': 'Validation',
    'Plateforme Quanser': 'Quanser platform',

    // Rover
    'Robot agricole': 'Agricultural robot',
    'autonome type rover': 'autonomous rover',
    'Concevoir et fabriquer un rover agricole à six, sur deux semestres : d\'un cahier des charges chiffré jusqu\'à une machine assemblée, pilotable à distance depuis une interface web puis capable de se déplacer seule.':
      'Designing and building an agricultural rover as a team of six, over two semesters: from a quantified specification to an assembled machine, driven remotely from a web interface and then able to move on its own.',
    'Trajectoire à points de passage — représentation schématique': 'Waypoint trajectory — schematic view',
    'Projet de mécatronique et robotique mené à Junia HEI en équipe de six étudiants, sur deux semestres, sous l\'encadrement de M. Tagne. L\'objectif : concevoir':
      'A mechatronics and robotics project run at Junia HEI in a team of six students, over two semesters, supervised by Mr Tagne. The goal: to design',
    'fabriquer un rover agricole — pas une maquette, une machine complète.':
      'build an agricultural rover — not a mock-up, a complete machine.',
    'C\'est le projet qui rassemble le plus de disciplines à la fois : sans les bons actionneurs le robot ne bouge pas, sans les bons capteurs il ne sait pas où il est, sans châssis correctement dimensionné rien ne tient, et sans code cohérent l\'ensemble reste inerte.':
      'This is the project that brings the most disciplines together at once: without the right actuators the robot does not move, without the right sensors it does not know where it is, without a properly sized chassis nothing holds, and without coherent code the whole thing stays inert.',
    'Le cahier des charges a été construit par analyse fonctionnelle, en distinguant fonctions principales et contraintes, puis traduit en critères chiffrés et vérifiables.':
      'The specification was built through functional analysis, separating main functions from constraints, then translated into quantified, verifiable criteria.',
    'Franchissement': 'Obstacle clearance',
    'Vitesse': 'Speed',
    'Évitement': 'Avoidance',
    'Trajectoire': 'Path planning',
    'Obstacles jusqu\'à 30 cm de dénivelé': 'Obstacles up to 30 cm high',
    '5 km/h, soit environ 27,8 rad/s pour des roues de 5 cm de rayon':
      '5 km/h, about 27.8 rad/s for wheels with a 5 cm radius',
    'Obstacles contournés à 20 cm minimum': 'Obstacles cleared by at least 20 cm',
    'Planification avec un angle maximal de 50 degrés': 'Planning with a maximum angle of 50 degrees',
    'Cadrage et planification': 'Framing and planning',
    'J\'ai commencé par découper le projet en lots et bâtir un diagramme de Gantt, pour que le groupe garde une ligne directrice sur toute la durée. J\'ai ensuite participé à l\'élaboration du cahier des charges et à l\'analyse fonctionnelle.':
      'I started by splitting the project into work packages and building a Gantt chart, so the group would keep a clear line throughout. I then took part in drawing up the specification and the functional analysis.',
    'Choix des composants': 'Choosing the components',
    'Analyse des actionneurs et des capteurs nécessaires. Le cœur retenu est une carte OpenCR — compatible Arduino IDE et ROS, pensée pour les robots mobiles — associée à un Raspberry Pi pour la partie haut niveau.':
      'Analysis of the actuators and sensors required. The core chosen is an OpenCR board — Arduino IDE and ROS compatible, designed for mobile robots — paired with a Raspberry Pi for the high-level side.',
    'Conception mécanique sur SolidWorks': 'Mechanical design in SolidWorks',
    'Dessin des pièces du rover en vue de leur fabrication, impression 3D comprise — l\'étape où les choix du dessin se paient ou se rentabilisent à l\'assemblage.':
      'Drawing the rover parts for manufacture, 3D printing included — the stage where design choices are paid for, or pay off, at assembly.',
    'Chaîne logicielle distribuée': 'Distributed software chain',
    'L\'architecture répartit les rôles : un firmware sur l\'OpenCR pour la commande des moteurs, une interface Python sur le Raspberry Pi, et un serveur web capable de traiter plusieurs requêtes en parallèle pour piloter le rover depuis un navigateur. J\'ai contribué au code de commande des moteurs et au transfert des données de l\'OpenCR vers le Raspberry Pi.':
      'The architecture splits the roles: firmware on the OpenCR for motor control, a Python interface on the Raspberry Pi, and a web server able to handle several requests in parallel so the rover can be driven from a browser. I contributed to the motor-control code and to transferring data from the OpenCR to the Raspberry Pi.',
    'Vers la navigation autonome': 'Towards autonomous navigation',
    'Le second semestre introduit une architecture ROS 2 et les briques de planification de trajectoire, locale et globale, pour passer du pilotage à distance au déplacement autonome.':
      'The second semester introduces a ROS 2 architecture and the path-planning blocks, local and global, to move from remote driving to autonomous motion.',
    'Arbitrage en cours de route': 'A mid-course trade-off',
    'À mi-parcours, concevoir un rover entièrement neuf s\'est révélé irréaliste dans le temps imparti. Le groupe a fait le choix de sécuriser la conception mécanique et d\'avancer plus tôt que prévu sur la partie logicielle. Le prototype a été assemblé et rendu testable — savoir renoncer à temps fait aussi partie du pilotage.':
      'Halfway through, designing an entirely new rover proved unrealistic in the time available. The group chose to secure the mechanical design and to move onto the software side earlier than planned. The prototype was assembled and made testable — knowing when to give something up is also part of leading a project.',
    'Conception de pièces': 'Part design',
    'Assemblage': 'Assembly',
    'Électronique & code': 'Electronics & code',
    'Interface web': 'Web interface',
    'Pilotage': 'Leadership',
    'Diagramme de Gantt': 'Gantt chart',
    'Analyse fonctionnelle': 'Functional analysis',
    'Cahier des charges': 'Specification',
    'Répartition des tâches': 'Task allocation',

    // Frigo du désert
    'du désert': 'fridge',
    'Frigo': 'Desert',
    'Comment conserver des aliments au frais sans électricité ? Un projet d\'intégration mené à dix, qui part d\'une question sociale concrète pour aboutir à un réfrigérateur sans moteur, sans batterie et sans fluide frigorigène.':
      'How do you keep food cool without electricity? An integration project run by ten students, starting from a concrete social question and ending in a fridge with no motor, no battery and no refrigerant.',
    'Évaporation au-dessus de l\'enceinte — représentation schématique':
      'Evaporation above the enclosure — schematic view',
    'Premier projet d\'équipe de mon cursus, mené dans le cadre PISTE — Projet d\'Intégration Scientifique, Technologique et Économique — à dix étudiants, sur 2023 et 2024.':
      'The first team project of my studies, run within the PISTE framework — a scientific, technological and economic integration project — with ten students, across 2023 and 2024.',
    'Le sujet posé : comment aider les personnes à conserver des aliments au frais sans électricité ? La question n\'a rien d\'abstrait — elle concerne les zones privées de réseau et les foyers pour qui un réfrigérateur reste hors de portée.':
      'The question set: how can people be helped to keep food cool without electricity? It is anything but abstract — it concerns areas off the grid and households for whom a fridge remains out of reach.',
    'Trois pistes ont été étudiées : le réfrigérateur enterré et le puits canadien, tous deux géothermiques, et le frigo du désert. Les deux premières laissant peu de marge d\'amélioration réelle, le groupe s\'est concentré sur la troisième.':
      'Three options were studied: the buried fridge and the ground-coupled heat exchanger, both geothermal, and the desert fridge. The first two left little room for genuine improvement, so the group focused on the third.',
    'Le frigo du désert, aussi appelé canari frigo, a été conçu dans les années 1990 par l\'universitaire nigérian Mohammed Bah Abba. Il ne demande ni moteur, ni batterie, ni fluide frigorigène.':
      'The desert fridge, also known as the pot-in-pot cooler, was devised in the 1990s by the Nigerian teacher Mohammed Bah Abba. It needs no motor, no battery and no refrigerant.',
    'Son fonctionnement tient à l\'évaporation : l\'eau qui s\'évapore prélève de la chaleur au milieu qu\'elle quitte, et c\'est cette chaleur en moins qui fait baisser la température à l\'intérieur de l\'enceinte. Sans source d\'énergie à ajuster, il ne reste qu\'un levier, la conception elle-même.':
      'It works by evaporation: water turning to vapour draws heat from the medium it leaves, and it is that missing heat which lowers the temperature inside the enclosure. With no energy source to tune, only one lever is left — the design itself.',
    'Fruits et légumes': 'Fruit and vegetables',
    'Produits laitiers': 'Dairy products',
    'Viande et poisson': 'Meat and fish',
    'Contrainte': 'Constraint',
    '2 à 10 °C, pour ralentir la maturation sans provoquer de dégâts au froid':
      '2 to 10 °C, to slow ripening without causing chill damage',
    '0 à 4 °C': '0 to 4 °C',
    'Au plus près de 0 °C': 'As close to 0 °C as possible',
    'Aucune alimentation électrique, aucune pièce mobile': 'No power supply, no moving parts',
    'Cadrage du besoin': 'Framing the need',
    'Identification des besoins, définition des objectifs et rédaction du cahier des charges, y compris les températures cibles par famille d\'aliments, qui fixent la performance à atteindre.':
      'Identifying needs, setting objectives and writing the specification, including the target temperatures per food family, which set the performance to reach.',
    'Étude des solutions existantes': 'Reviewing existing solutions',
    'Comparaison du réfrigérateur enterré, du puits canadien et du frigo du désert. La consigne de l\'encadrant était nette : proposer une amélioration tangible plutôt qu\'un exposé de concepts.':
      'Comparing the buried fridge, the ground-coupled heat exchanger and the desert fridge. The supervisor\'s instruction was clear: propose a tangible improvement rather than a survey of concepts.',
    'Conception et modélisation': 'Design and modelling',
    'Conception et modélisation du système de refroidissement passif, avec pour angle d\'amélioration le choix des matériaux — c\'est là que se joue l\'essentiel de la performance d\'un dispositif sans apport d\'énergie.':
      'Designing and modelling the passive cooling system, with material choice as the angle of improvement — that is where most of the performance of an energy-free device is decided.',
    'Prototype et conduite de projet': 'Prototype and project management',
    'Planification, répartition des responsabilités, identification des risques et suivi de l\'avancement jusqu\'à la clôture du projet. À dix, s\'accorder sur des hypothèses communes avant de calculer quoi que ce soit était une part entière du travail.':
      'Planning, sharing out responsibilities, identifying risks and tracking progress through to project closure. With ten people, agreeing on common assumptions before computing anything was a full part of the work.',
    'C\'est le projet qui m\'a fait découvrir le travail d\'ingénierie en équipe, et la différence entre une bonne idée et une solution défendable : un système sans énergie d\'appoint ne pardonne rien, chaque paramètre de conception se retrouve directement dans la performance finale.':
      'This is the project that introduced me to engineering as a team, and to the difference between a good idea and a defensible solution: a system with no auxiliary energy forgives nothing, every design parameter lands straight in the final performance.',
    'L\'enceinte en cours d\'impression : les nervures extérieures augmentent la surface d\'échange avec l\'air.':
      'The enclosure mid-print: the outer ribs increase the surface exchanging heat with the air.',
    'Le prototype une fois sorti du plateau, supports encore en place.':
      'The prototype straight off the build plate, supports still attached.',
    'Impression 3D de l\'enceinte du frigo du désert': '3D printing of the desert fridge enclosure',
    'Prototype imprimé du frigo du désert, posé sur un bureau':
      'Printed prototype of the desert fridge, sitting on a desk',
    'Refroidissement passif': 'Passive cooling',
    'Évaporation': 'Evaporation',
    'Choix des matériaux': 'Material selection',
    'Démarche': 'Approach',
    'Prototypage': 'Prototyping',
    'Organisation': 'Organisation',
    'Équipe de 10': 'Team of 10',
    'Planification': 'Planning',
    'Gestion des risques': 'Risk management',
    'Gestion des échéances': 'Deadline management',
    'Ce que devient le robot': 'What the robot becomes'
  };

  /* 04. ATTRIBUTS ET TITRES DE PAGE
     ---------------------------------------------------------------------- */
  var ATTRS = {
    'Ouvrir sur téléphone': 'Open on phone',
    'Afficher le QR code du site': 'Show the site QR code',
    'Afficher le QR code de la page': 'Show the page QR code',
    'Basculer le thème': 'Toggle theme',
    'Basculer le thème sombre': 'Switch to dark theme',
    'Activer le thème clair': 'Switch to light theme',
    'Activer le thème sombre': 'Switch to dark theme',
    'Ouvrir le menu': 'Open menu',
    'Fermer le menu': 'Close menu',
    'Fermer': 'Close',
    'Navigation principale': 'Main navigation',
    'Autres projets': 'Other projects',
    'Copier l\'adresse e-mail': 'Copy the email address',
    'Copier dans le presse-papiers': 'Copy to clipboard',
    'Aperçu du CV de Romain Lance': 'Preview of Romain Lance\'s CV',
    'Aller à la section À propos': 'Go to the About section',
    'France · Canada · Malte': 'France · Canada · Malta',
    'Portfolio de Romain Lance, ingénieur en mécatronique et robotique : robotique mobile, ROS 2, modélisation dynamique, conception mécanique et systèmes embarqués.':
      'Portfolio of Romain Lance, mechatronics and robotics engineer: mobile robotics, ROS 2, dynamic modelling, mechanical design and embedded systems.',
    'Robotique mobile, ROS 2, modélisation dynamique et conception mécatronique.':
      'Mobile robotics, ROS 2, dynamic modelling and mechatronic design.'
  };

  var TITLES = {
    'Romain Lance — Ingénieur Mécatronique & Robotique':
      'Romain Lance — Mechatronics & Robotics Engineer',
    'Dino — plateforme de recherche ROS 2 — Romain Lance':
      'Dino — a ROS 2 research platform — Romain Lance',
    'Modèle dynamique d\'un fauteuil roulant intelligent — Romain Lance':
      'Dynamic model of a smart wheelchair — Romain Lance',
    'Robot agricole autonome type rover — Romain Lance':
      'Autonomous agricultural rover — Romain Lance',
    'Frigo du désert — Romain Lance': 'Desert fridge — Romain Lance'
  };

  /* Les clés sont comparées après normalisation des blancs : dans le HTML, une
     même phrase est coupée en plusieurs lignes et indentée, et contient parfois
     des espaces insécables. Sans cette étape, la moindre reprise de la mise en
     forme du HTML ferait silencieusement échouer la traduction. */
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

  function merge(target, part) {
    for (var k in part) {
      if (Object.prototype.hasOwnProperty.call(part, k)) { target[norm(k)] = part[k]; }
    }
    return target;
  }

  var DICT = {};
  [UI, HOME, PROJECTS].forEach(function (part) { merge(DICT, part); });
  ATTRS = merge({}, ATTRS);
  TITLES = merge({}, TITLES);

  /* 05. APPLICATION DE LA LANGUE
     ---------------------------------------------------------------------- */
  var TRANSLATABLE_ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1 };

  var originals = null;   // relevé du français, fait une seule fois

  function collect() {
    if (originals) { return originals; }
    originals = { nodes: [], attrs: [], title: document.title };

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (SKIP_TAGS[node.parentNode.nodeName]) { return NodeFilter.FILTER_REJECT; }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n;
    while ((n = walker.nextNode())) { originals.nodes.push({ node: n, fr: n.nodeValue }); }

    var all = document.querySelectorAll('[title], [aria-label], [placeholder], [alt]');
    Array.prototype.forEach.call(all, function (el) {
      TRANSLATABLE_ATTRS.forEach(function (a) {
        if (el.hasAttribute(a)) { originals.attrs.push({ el: el, attr: a, fr: el.getAttribute(a) }); }
      });
    });

    return originals;
  }

  // Traduit en préservant les blancs d'origine autour du texte : ce sont eux
  // qui séparent un fragment traduit du texte qui l'entoure dans la phrase.
  function translateText(raw) {
    var en = DICT[norm(raw)];
    if (!en) { return null; }
    return raw.match(/^\s*/)[0] + en + raw.match(/\s*$/)[0];
  }

  function apply(lang) {
    var data = collect();

    data.nodes.forEach(function (entry) {
      if (lang === 'fr') { entry.node.nodeValue = entry.fr; return; }
      var out = translateText(entry.fr);
      if (out !== null) { entry.node.nodeValue = out; }
    });

    data.attrs.forEach(function (entry) {
      if (lang === 'fr') { entry.el.setAttribute(entry.attr, entry.fr); return; }
      var en = ATTRS[norm(entry.fr)] || DICT[norm(entry.fr)];
      if (en) { entry.el.setAttribute(entry.attr, en); }
    });

    document.title = lang === 'fr' ? data.title : (TITLES[norm(data.title)] || data.title);
    document.documentElement.lang = lang;

    swapCv();   // lit document.documentElement.lang, posé juste au-dessus
    try { localStorage.setItem('lang', lang); } catch (e) { /* stockage indisponible */ }
  }

  /* Bascule d'un fichier du CV (PDF ou vignette).
     `known` mémorise le résultat du test d'existence pour ne le faire qu'une
     fois par fichier ; tant qu'il est indéterminé, on reste sur le français. */
  var known = {};

  function swapFile(el, attr, files) {
    if (!el) { return; }

    // Le chemin est reconstruit depuis la valeur courante : les pages projet
    // vivent dans un sous-dossier, l'adresse y est donc préfixée de « ../ ».
    var dir = el.getAttribute(attr).replace(/[^/]+$/, '');
    function url(file) { return dir + file.replace(/^assets\//, ''); }
    function set(file) { el.setAttribute(attr, url(file)); }

    if (document.documentElement.lang !== 'en') { set(files.fr); return; }
    if (known[files.en] === true) { set(files.en); return; }
    if (known[files.en] === false) { return; }

    fetch(url(files.en), { method: 'HEAD' })
      .then(function (r) {
        known[files.en] = r.ok;
        if (r.ok && document.documentElement.lang === 'en') { set(files.en); }
      })
      .catch(function () { known[files.en] = false; });
  }

  function swapCv() {
    swapFile(document.getElementById('cvCard'), 'href', CV.pdf);
    swapFile(document.querySelector('#cvCard .cv__page'), 'src', CV.img);
  }

  /* 06. BOUTON DE BASCULE
     ---------------------------------------------------------------------- */
  function init() {
    var btn = document.getElementById('langToggle');
    var stored = null;
    try { stored = localStorage.getItem('lang'); } catch (e) { /* ignoré */ }

    var lang = stored === 'en' ? 'en' : 'fr';

    function label() {
      if (!btn) { return; }
      // Le bouton annonce la langue vers laquelle il fait basculer
      btn.textContent = lang === 'fr' ? 'EN' : 'FR';
      btn.setAttribute('aria-label',
        lang === 'fr' ? 'Switch to English' : 'Afficher le site en français');
      btn.setAttribute('title', btn.getAttribute('aria-label'));
    }

    if (lang === 'en') { apply('en'); }
    label();

    if (btn) {
      btn.addEventListener('click', function () {
        lang = lang === 'fr' ? 'en' : 'fr';
        apply(lang);
        label();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposé pour le contrôle de couverture des traductions
  root.portfolioI18n = { dict: DICT, attrs: ATTRS, titles: TITLES };

})(typeof window !== 'undefined' ? window : globalThis);
