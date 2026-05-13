/**
 * fetch-images.js — Run ONCE to fetch Unsplash photo URLs for every exercise.
 *
 * Uses the Unsplash API (free, no key needed for source.unsplash.com)
 * to find a relevant photo per exercise, then writes the URL into
 * data-fr.js and data-en.js as an `img` field.
 *
 * Usage:
 *   node fetch-images.js
 *
 * Requirements: Node.js 18+
 *
 * After running:
 *   - Check the console log for ✓ / ✗ results
 *   - Open bad images manually and replace the URL in data-en.js / data-fr.js
 *   - The `img` field is shared between FR and EN (same photo)
 */

const fs   = require('fs');
const path = require('path');

const DELAY_MS = 500;
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Unsplash search (no API key needed via source.unsplash.com) ──────────────
// Returns a stable redirected URL for a given query
async function fetchUnsplashUrl(query) {
    // source.unsplash.com redirects to a real image URL
    const sourceUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(query)},exercise,fitness`;

    try {
        const res = await fetch(sourceUrl, {
            method: 'HEAD',
            redirect: 'follow',
        });

        // The final URL after redirect is the actual image
        if (res.ok && res.url && res.url.includes('images.unsplash.com')) {
            return res.url;
        }

        // Fallback: use the source URL directly (browser will follow redirect)
        return sourceUrl;

    } catch (e) {
        console.error(`  ✗ Fetch error: ${e.message}`);
        return null;
    }
}

// ─── Load data file ───────────────────────────────────────────────────────────
function loadData(filePath) {
    const code    = fs.readFileSync(filePath, 'utf8');
    const match   = code.match(/^const\s+(data\w+)\s*=/m);
    if (!match) throw new Error(`Cannot find data variable in ${filePath}`);
    const varName = match[1];
    const fn      = new Function(`${code}; return ${varName};`);
    return { varName, data: fn() };
}

// ─── Serialize data back to JS ────────────────────────────────────────────────
function serializeData(varName, data) {
    const lines = [];
    lines.push(`/* AUTO-GENERATED — do not edit manually */`);
    lines.push(`/* Re-run fetch-videos.js and fetch-images.js to refresh */\n`);
    lines.push(`const ${varName} = {`);

    lines.push(`    ui: {`);
    for (const [k, v] of Object.entries(data.ui)) {
        lines.push(`        ${k}: ${JSON.stringify(v)},`);
    }
    lines.push(`    },\n`);

    for (const section of ['intense', 'senior']) {
        lines.push(`    ${section}: [`);
        for (const exo of data[section]) {
            const fields = [
                `name: ${JSON.stringify(exo.name)}`,
                `min: ${exo.min}`,
                `max: ${exo.max}`,
                `unit: ${JSON.stringify(exo.unit)}`,
                `emoji: ${JSON.stringify(exo.emoji)}`,
                `type: ${JSON.stringify(exo.type)}`,
                `desc: ${JSON.stringify(exo.desc || '')}`,
            ];
            if (exo.note)    fields.push(`note: ${JSON.stringify(exo.note)}`);
            if (exo.videoId) fields.push(`videoId: ${JSON.stringify(exo.videoId)}`);
            if (exo.img)     fields.push(`img: ${JSON.stringify(exo.img)}`);
            lines.push(`        { ${fields.join(', ')} },`);
        }
        lines.push(`    ],\n`);
    }

    lines.push(`};`);
    return lines.join('\n');
}

// ─── Search query per exercise (more specific = better photo) ─────────────────
function buildQuery(exo) {
    // Map exercise names to better Unsplash search terms
    const overrides = {
        'Push-ups':              'man doing push-ups floor',
        'Pompes Classiques':     'man doing push-ups floor',
        'Wide Arm Push-ups':     'wide pushup exercise',
        'Pompes Prise Large':    'wide pushup exercise',
        'Diamond Push-ups':      'tricep pushup close grip',
        'Squats':                'woman squat exercise legs',
        'Squats Sautés':         'jump squat explosive',
        'Jump Squats':           'jump squat explosive',
        'Plank':                 'plank exercise core',
        'Gainage (Planche)':     'plank exercise core',
        'Burpees':               'burpee workout jumping',
        'Mountain Climbers':     'mountain climbers exercise',
        'Jumping Jacks':         'jumping jacks cardio',
        'Lunges':                'lunge exercise legs',
        'Fentes Avant':          'forward lunge exercise',
        'Glute Bridges':         'glute bridge exercise floor',
        'Pont Fessier':          'glute bridge exercise floor',
        'Crunches':              'crunches abs exercise floor',
        'Crunchs':               'crunches abs exercise floor',
        'Russian Twists':        'russian twist core exercise',
        'Superman Hold':         'superman exercise back floor',
        'Superman':              'superman exercise back floor',
        'Child\'s Pose':         'child pose yoga stretch',
        'Posture de l\'Enfant':  'child pose yoga stretch',
        'Cobra Stretch':         'cobra pose yoga backbend',
        'Cobra':                 'cobra pose yoga backbend',
        'Downward Dog':          'downward dog yoga pose',
        'Chien Tête en Bas':     'downward dog yoga pose',
        'Wall Sit':              'wall sit exercise legs',
        'La Chaise (Mur)':       'wall sit exercise legs',
        'Calf Raises':           'calf raise exercise standing',
        'Mollets Debout':        'calf raise exercise standing',
        'Butterfly Stretch':     'butterfly stretch flexibility',
        'Papillon':              'butterfly stretch flexibility',
        'Pigeon Pose':           'pigeon pose yoga hip stretch',
        'Pigeon':                'pigeon pose yoga hip stretch',
        'High Knees':            'high knees running cardio',
        'Montées de Genoux':     'high knees running cardio',
        'Tricep Dips':           'tricep dips chair exercise',
        'Dips Triceps':          'tricep dips chair exercise',
        'Inchworm':              'inchworm exercise warmup',
        'Bear Crawl':            'bear crawl exercise floor',
        'Skaters':               'skater jump lateral exercise',
        'Pas du Patineur':       'lateral skater jump exercise',
        'Butt Kicks':            'butt kicks running exercise',
        'Talons-Fesses':         'butt kicks running exercise',
        'Side Plank':            'side plank exercise oblique',
        'Gainage Latéral':       'side plank exercise oblique',
        'Leg Raises':            'leg raises abs exercise',
        'Levés de Jambes':       'leg raises abs exercise',
        'Bicycle Crunches':      'bicycle crunches abs',
        'Bicyclette':            'bicycle crunches abs',
        'Flutter Kicks':         'flutter kicks abs exercise',
        'Battements Jambes':     'flutter kicks abs exercise',
        'Donkey Kicks':          'donkey kick exercise glute',
        'Kicks Arrière':         'donkey kick exercise glute',
        'Forward Lunges':        'forward lunge exercise',
        'Reverse Lunges':        'reverse lunge exercise',
        'Fentes Arrière':        'reverse lunge exercise',
        'Side Lunges':           'side lunge exercise',
        'Fentes Latérales':      'side lunge exercise',
        'Cat-Cow':               'cat cow yoga stretch',
        'Chat-Vache':            'cat cow yoga stretch',
        'Happy Baby':            'happy baby yoga pose',
        'Bébé Heureux':          'happy baby yoga pose',
        'Wall Push-ups':         'wall push up exercise',
        'Pompes au Mur':         'wall push up exercise',
        'Chair Squats':          'chair squat senior exercise',
        'Squat Chaise':          'sit to stand senior exercise',
        'Seated March':          'seated marching senior exercise',
        'Marche Assise':         'seated exercise elderly chair',
        'Single Leg Balance':    'balance one leg exercise',
        'Équilibre 1 Jambe':     'balance one leg exercise',
        'Shadow Boxing':         'shadow boxing exercise',
        'Boxe dans le vide':     'shadow boxing exercise',
        'March in Place':        'marching in place senior',
        'Marche sur Place':      'marching in place senior',
    };

    return overrides[exo.name] || `${exo.name} exercise fitness workout`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const frPath = path.join(__dirname, 'js/data-fr.js');
    const enPath = path.join(__dirname, 'js/data-en.js');

    const { varName: varFR, data: dataFR } = loadData(frPath);
    const { varName: varEN, data: dataEN } = loadData(enPath);

    let total = 0, found = 0;

    for (const section of ['intense', 'senior']) {
        console.log(`\n════════════════════════════════`);
        console.log(`📂 Section: ${section}`);
        console.log(`════════════════════════════════`);

        for (let i = 0; i < dataEN[section].length; i++) {
            const exoEN = dataEN[section][i];
            const exoFR = dataFR[section][i];
            total++;

            // Skip if already has an image
            if (exoEN.img) {
                found++;
                console.log(`  [${total}] ${exoEN.name} ... ⏭ skipped`);
                continue;
            }

            process.stdout.write(`  [${total}] ${exoEN.name} ... `);

            const query = buildQuery(exoEN);
            const url   = await fetchUnsplashUrl(query);

            if (url) {
                exoEN.img = url;
                exoFR.img = url; // shared between languages
                found++;
                console.log(`✓`);
            } else {
                console.log(`✗`);
            }

            await delay(DELAY_MS);
        }
    }

    fs.writeFileSync(frPath, serializeData(varFR, dataFR), 'utf8');
    fs.writeFileSync(enPath, serializeData(varEN, dataEN), 'utf8');

    console.log(`\n✅ ${found}/${total} images fetched`);
    console.log(`📁 data-fr.js and data-en.js updated`);
    console.log(`\n💡 To replace a bad photo, find the exercise in data-en.js`);
    console.log(`   and update the img URL with a better Unsplash link:`);
    console.log(`   https://images.unsplash.com/photo-XXXXX?w=400&h=400&fit=crop`);
}

main().catch(console.error);
