/* =============================================
   Quick Sport App — data-fr.js
   Données françaises : 50 exercices intense + 30 senior
   ============================================= */

const dataFR = {
    ui: {
        choose:       "CHOISISSEZ VOTRE PROGRAMME",
        intenseTitle: "Mode Sportif",
        intenseDesc:  "Cardio, Pompes, Gainage, Burpees...<br><i>(50 Exercices)</i>",
        seniorTitle:  "Gym Douce",
        seniorDesc:   "Mobilité, Équilibre, Chaise & Mur.<br><i>(30 Exercices)</i>",
        change:         "⚙️ Changer de programme",
        video:          "▶ Voir la vidéo sur YouTube",
        videoSearching: "🔍 Recherche de la vidéo...",
        next:           "EXERCICE SUIVANT",
        ready:        "Prêt ?",
        loading:      "Chargement...",
    },

    // ------ 50 EXERCICES INTENSE ------
    intense: [
        // FORCE
        { name: "Pompes Classiques",    min: 10, max: 20, unit: "reps",       emoji: "🙇", type: "Force" },
        { name: "Pompes Prise Large",   min: 8,  max: 15, unit: "reps",       emoji: "↔️", type: "Force" },
        { name: "Pompes Diamant",       min: 5,  max: 12, unit: "reps",       emoji: "💎", type: "Force" },
        { name: "Pompes Inclinées",     min: 10, max: 20, unit: "reps",       emoji: "🛋️", type: "Force" },
        { name: "Pompes Piquées (Pike)",min: 8,  max: 12, unit: "reps",       emoji: "📐", type: "Force" },
        { name: "Toucher d'épaules",    min: 20, max: 40, unit: "reps",       emoji: "👋", type: "Force" },
        { name: "Dips Triceps",         min: 10, max: 20, unit: "reps",       emoji: "🪑", type: "Bras"  },
        { name: "Cercles de Bras",      min: 30, max: 60, unit: "sec",        emoji: "⭕", type: "Bras"  },
        // JAMBES
        { name: "Squats",               min: 15, max: 30, unit: "reps",       emoji: "🦵", type: "Jambes" },
        { name: "Squats Sumo",          min: 15, max: 30, unit: "reps",       emoji: "🦀", type: "Jambes" },
        { name: "Squats Sautés",        min: 10, max: 20, unit: "reps",       emoji: "🚀", type: "Jambes" },
        { name: "La Chaise (Mur)",      min: 30, max: 60, unit: "sec",        emoji: "🧱", type: "Jambes" },
        { name: "Fentes Avant",         min: 10, max: 20, unit: "reps",       emoji: "🚶", type: "Jambes" },
        { name: "Fentes Arrière",       min: 10, max: 20, unit: "reps",       emoji: "🔙", type: "Jambes" },
        { name: "Fentes Latérales",     min: 10, max: 20, unit: "reps",       emoji: "↔️", type: "Jambes" },
        { name: "Mollets Debout",       min: 20, max: 40, unit: "reps",       emoji: "👠", type: "Jambes" },
        { name: "Pont Fessier",         min: 15, max: 30, unit: "reps",       emoji: "🌉", type: "Jambes" },
        { name: "Kicks Arrière",        min: 15, max: 25, unit: "reps",       emoji: "🐎", type: "Jambes" },
        // ABDOS / CORE
        { name: "Gainage (Planche)",    min: 30, max: 60, unit: "sec",        emoji: "➖", type: "Gainage"    },
        { name: "Gainage Latéral",      min: 20, max: 45, unit: "sec/côté",   emoji: "📐", type: "Gainage"    },
        { name: "Crunchs",              min: 15, max: 30, unit: "reps",       emoji: "🍫", type: "Abdos"      },
        { name: "Bicyclette",           min: 20, max: 40, unit: "reps",       emoji: "🚲", type: "Abdos"      },
        { name: "Levés de Jambes",      min: 10, max: 20, unit: "reps",       emoji: "👖", type: "Abdos"      },
        { name: "Russian Twists",       min: 20, max: 40, unit: "reps",       emoji: "🔄", type: "Abdos"      },
        { name: "Battements Jambes",    min: 20, max: 40, unit: "sec",        emoji: "🏊", type: "Abdos"      },
        { name: "Mountain Climbers",    min: 20, max: 40, unit: "sec",        emoji: "⛰️", type: "Cardio/Abs" },
        { name: "Superman",             min: 20, max: 40, unit: "sec",        emoji: "🦸", type: "Dos"        },
        // CARDIO
        { name: "Jumping Jacks",        min: 30, max: 60, unit: "reps",       emoji: "🙆", type: "Cardio" },
        { name: "Burpees",              min: 5,  max: 15, unit: "reps",       emoji: "🥵", type: "Cardio" },
        { name: "Montées de Genoux",    min: 20, max: 40, unit: "sec",        emoji: "🏃", type: "Cardio" },
        { name: "Talons-Fesses",        min: 20, max: 40, unit: "sec",        emoji: "👟", type: "Cardio" },
        { name: "Pas du Patineur",      min: 20, max: 40, unit: "reps",       emoji: "⛸️", type: "Cardio" },
        // STRETCHING
        { name: "Posture de l'Enfant",  min: 30, max: 60, unit: "sec",        emoji: "👶", type: "Yoga"      },
        { name: "Cobra",                min: 20, max: 40, unit: "sec",        emoji: "🐍", type: "Yoga"      },
        { name: "Chat-Vache",           min: 30, max: 60, unit: "sec",        emoji: "🐈", type: "Yoga"      },
        { name: "Chien Tête en Bas",    min: 20, max: 40, unit: "sec",        emoji: "🐕", type: "Yoga"      },
        { name: "Étirement Ischios",    min: 20, max: 40, unit: "sec/jambe",  emoji: "🦵", type: "Souplesse" },
        { name: "Étirement Quadriceps", min: 20, max: 40, unit: "sec/jambe",  emoji: "🦩", type: "Souplesse" },
        { name: "Papillon",             min: 30, max: 60, unit: "sec",        emoji: "🦋", type: "Souplesse" },
        { name: "Étirement Épaules",    min: 20, max: 30, unit: "sec/bras",   emoji: "🫂", type: "Souplesse" },
        { name: "Étirement Triceps",    min: 20, max: 30, unit: "sec/bras",   emoji: "💪", type: "Souplesse" },
        { name: "Pigeon",               min: 30, max: 60, unit: "sec/jambe",  emoji: "🐦", type: "Souplesse" },
        // BONUS pour compléter à 50
        { name: "Inchworm",             min: 5,  max: 10, unit: "reps",       emoji: "🐛", type: "Cardio/Force" },
        { name: "Rotation des Hanches", min: 20, max: 40, unit: "sec",        emoji: "🌀", type: "Mobilité"     },
        { name: "Pompes Lentes (4s)",   min: 5,  max: 10, unit: "reps",       emoji: "🐢", type: "Force"        },
        { name: "Saut à la Corde (sim)",min: 30, max: 60, unit: "sec",        emoji: "🪢", type: "Cardio"       },
        { name: "Frog Jumps",           min: 8,  max: 15, unit: "reps",       emoji: "🐸", type: "Cardio"       },
        { name: "Squat Isométrique",    min: 20, max: 45, unit: "sec",        emoji: "🧱", type: "Jambes"       },
        { name: "Bébé Heureux",         min: 30, max: 60, unit: "sec",        emoji: "🍼", type: "Yoga"         },
        { name: "Rameur Chaise",        min: 10, max: 20, unit: "reps",       emoji: "🚪", type: "Dos"          },
    ],

    // ------ 30 EXERCICES SENIOR ------
    senior: [
        // ASSIS (CHAISE)
        { name: "Marche Assise",        min: 30, max: 60, unit: "sec",  emoji: "🪑", type: "Cardio Doux",  note: "Levez les genoux en alternance." },
        { name: "Extension Jambe",      min: 10, max: 15, unit: "reps", emoji: "🦵", type: "Jambes",        note: "Tendez la jambe à l'horizontale." },
        { name: "Rotation Épaules",     min: 20, max: 40, unit: "sec",  emoji: "🙆", type: "Mobilité",      note: "Grands cercles lents en arrière." },
        { name: "Flexion Chevilles",    min: 10, max: 20, unit: "reps", emoji: "🦶", type: "Mobilité",      note: "Pointez, puis relevez les orteils." },
        { name: "Rotation Buste",       min: 10, max: 20, unit: "reps", emoji: "🔄", type: "Dos",           note: "Tournez doucement gauche/droite." },
        { name: "Lever de Bras",        min: 10, max: 15, unit: "reps", emoji: "🙋", type: "Bras",          note: "Levez les mains vers le plafond." },
        { name: "Serrer les Poings",    min: 10, max: 20, unit: "reps", emoji: "✊", type: "Mains",         note: "Ouvrez grand, fermez fort." },
        { name: "Inclinaison Latérale", min: 10, max: 20, unit: "reps", emoji: "🎋", type: "Taille",        note: "Penchez doucement sur le côté." },
        { name: "Toucher Genou Opposé", min: 10, max: 20, unit: "reps", emoji: "✖️", type: "Coordination", note: "Main droite touche genou gauche." },
        // DEBOUT
        { name: "Pompes au Mur",        min: 8,  max: 12, unit: "reps", emoji: "🧱", type: "Force",    note: "Dos droit, pieds éloignés du mur." },
        { name: "Montée sur Pointes",   min: 10, max: 20, unit: "reps", emoji: "👠", type: "Équilibre", note: "Tenez le dossier de la chaise." },
        { name: "Squat Chaise",         min: 5,  max: 10, unit: "reps", emoji: "🛋️", type: "Jambes",   note: "Levez-vous et rasseyez-vous." },
        { name: "Équilibre 1 Jambe",    min: 10, max: 20, unit: "sec",  emoji: "🦩", type: "Équilibre", note: "Tenez le mur si nécessaire." },
        { name: "Talon-Fesse",          min: 10, max: 20, unit: "reps", emoji: "🔙", type: "Jambes",   note: "Genoux alignés, debout." },
        { name: "Élévation Latérale",   min: 8,  max: 15, unit: "reps", emoji: "↔️", type: "Hanches",  note: "Jambe sur le côté, buste droit." },
        { name: "Extension Hanche",     min: 10, max: 15, unit: "reps", emoji: "🐎", type: "Fessiers", note: "Jambe tendue vers l'arrière." },
        { name: "Mini Fentes",          min: 5,  max: 10, unit: "reps", emoji: "🚶", type: "Jambes",   note: "Un petit pas en avant, pliez un peu." },
        // MOBILITÉ & COU
        { name: "Rotation du Cou",      min: 20, max: 30, unit: "sec",  emoji: "💆", type: "Détente",      note: "Lentement, demi-cercles." },
        { name: "Oui-Non Tête",         min: 10, max: 15, unit: "reps", emoji: "🙂", type: "Cou",           note: "Regardez gauche/droite." },
        { name: "Serrer Omoplates",     min: 10, max: 15, unit: "reps", emoji: "👐", type: "Posture",       note: "Ouvrez la poitrine." },
        { name: "Dos Rond / Creux",     min: 20, max: 40, unit: "sec",  emoji: "🐈", type: "Dos",           note: "Mains sur les genoux, assis." },
        // COORDINATION & MARCHE
        { name: "Marche sur Place",     min: 30, max: 60, unit: "sec",  emoji: "🚶", type: "Cardio",        note: "Balancez bien les bras." },
        { name: "Pas Chassés",          min: 20, max: 40, unit: "sec",  emoji: "🦀", type: "Coordination",  note: "Petits pas sur le côté." },
        { name: "Marche Talon-Pointe",  min: 10, max: 20, unit: "pas",  emoji: "📏", type: "Équilibre",     note: "Comme sur une poutre." },
        { name: "Croisement Bras",      min: 20, max: 40, unit: "sec",  emoji: "🙅", type: "Coordination",  note: "Ouvrez et croisez devant." },
        { name: "Boxe dans le vide",    min: 20, max: 40, unit: "sec",  emoji: "🥊", type: "Cardio",        note: "Poings légers, sans forcer." },
        { name: "Rotation Poignets",    min: 20, max: 30, unit: "sec",  emoji: "👋", type: "Mains",         note: "Faites des cercles avec les poignets." },
        { name: "Rameur Assis",         min: 10, max: 20, unit: "reps", emoji: "🛶", type: "Dos",           note: "Tirez les coudes en arrière." },
        { name: "Chaise Appuyée",       min: 15, max: 30, unit: "sec",  emoji: "🪑", type: "Jambes",        note: "Adossez-vous légèrement au mur." },
        { name: "Tapements d'Orteils",  min: 10, max: 20, unit: "reps", emoji: "👟", type: "Coordination",  note: "Tapotez alternativement les pieds." },
    ],
};
