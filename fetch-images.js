/**
 * fetch-images.js — Run ONCE to download exercise photos locally.
 *
 * Downloads one Unsplash photo per exercise into /images/exercises/
 * then writes the local path into data-fr.js and data-en.js as `img`.
 *
 * Usage:
 *   node fetch-images.js
 *
 * Requirements: Node.js 18+
 *
 * After running:
 *   - Check /images/exercises/ to review photos
 *   - Replace any bad photo manually (keep the same filename)
 *   - Push everything to GitHub — Cloudflare serves the images for free
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(__dirname, 'images', 'exercises');
const DELAY_MS   = 600;
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Create images directory if needed ───────────────────────────────────────
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`📁 Created ${IMAGES_DIR}`);
}

// ─── Download image to local file ─────────────────────────────────────────────
function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);

        function get(url, redirects = 0) {
            if (redirects > 5) return reject(new Error('Too many redirects'));
            https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    return get(res.headers.location, redirects + 1);
                }
                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlink(destPath, () => {});
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
                file.on('error', reject);
            }).on('error', reject);
        }

        get(url);
    });
}

// ─── Build Unsplash search URL ────────────────────────────────────────────────
function buildUnsplashUrl(query) {
    // source.unsplash.com gives a random relevant image — no API key needed
    return `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
}

// ─── Safe filename from exercise name ────────────────────────────────────────
function toFilename(name) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '.jpg';
}

// ─── Search query per exercise ────────────────────────────────────────────────
function buildQuery(name) {
    const overrides = {
        'Push-ups':              'man doing push-ups floor',
        'Pompes Classiques':     'man doing push-ups floor',
        'Wide Arm Push-ups':     'wide pushup chest exercise',
        'Pompes Prise Large':    'wide pushup chest exercise',
        'Diamond Push-ups':      'tricep diamond pushup',
        'Pompes Diamant':        'tricep diamond pushup',
        'Incline Push-ups':      'incline pushup elevated',
        'Pompes Inclinées':      'incline pushup elevated',
        'Pike Push-ups':         'pike pushup shoulders',
        'Pompes Piquées (Pike)': 'pike pushup shoulders',
        'Shoulder Taps':         'plank shoulder tap core',
        "Toucher d'épaules":     'plank shoulder tap core',
        'Tricep Dips':           'tricep dips chair',
        'Dips Triceps':          'tricep dips chair',
        'Arm Circles':           'arm circles shoulder warmup',
        'Cercles de Bras':       'arm circles shoulder warmup',
        'Squats':                'woman squat exercise legs',
        'Sumo Squats':           'sumo squat wide stance',
        'Squats Sumo':           'sumo squat wide stance',
        'Jump Squats':           'jump squat explosive power',
        'Squats Sautés':         'jump squat explosive power',
        'Wall Sit':              'wall sit isometric legs',
        'La Chaise (Mur)':       'wall sit isometric legs',
        'Forward Lunges':        'forward lunge exercise',
        'Fentes Avant':          'forward lunge exercise',
        'Reverse Lunges':        'reverse lunge exercise',
        'Fentes Arrière':        'reverse lunge exercise',
        'Side Lunges':           'side lunge lateral exercise',
        'Fentes Latérales':      'side lunge lateral exercise',
        'Calf Raises':           'calf raise standing exercise',
        'Mollets Debout':        'calf raise standing exercise',
        'Glute Bridges':         'glute bridge floor exercise',
        'Pont Fessier':          'glute bridge floor exercise',
        'Donkey Kicks':          'donkey kick glute exercise',
        'Kicks Arrière':         'donkey kick glute exercise',
        'Plank':                 'plank core exercise',
        'Gainage (Planche)':     'plank core exercise',
        'Side Plank':            'side plank oblique exercise',
        'Gainage Latéral':       'side plank oblique exercise',
        'Crunches':              'crunches abs floor',
        'Crunchs':               'crunches abs floor',
        'Bicycle Crunches':      'bicycle crunches obliques',
        'Bicyclette':            'bicycle crunches obliques',
        'Leg Raises':            'leg raises abs floor',
        'Levés de Jambes':       'leg raises abs floor',
        'Russian Twists':        'russian twist core seated',
        'Flutter Kicks':         'flutter kicks abs floor',
        'Battements Jambes':     'flutter kicks abs floor',
        'Mountain Climbers':     'mountain climbers plank cardio',
        'Superman Hold':         'superman back extension floor',
        'Superman':              'superman back extension floor',
        'Jumping Jacks':         'jumping jacks cardio workout',
        'Burpees':               'burpee full body exercise',
        'High Knees':            'high knees running cardio',
        'Montées de Genoux':     'high knees running cardio',
        'Butt Kicks':            'butt kicks running warmup',
        'Talons-Fesses':         'butt kicks running warmup',
        'Skaters':               'lateral skater jump exercise',
        'Pas du Patineur':       'lateral skater jump exercise',
        "Child's Pose":          'childs pose yoga rest',
        "Posture de l'Enfant":   'childs pose yoga rest',
        'Cobra Stretch':         'cobra pose yoga backbend',
        'Cobra':                 'cobra pose yoga backbend',
        'Cat-Cow':               'cat cow yoga stretch',
        'Chat-Vache':            'cat cow yoga stretch',
        'Downward Dog':          'downward dog yoga pose',
        'Chien Tête en Bas':     'downward dog yoga pose',
        'Hamstring Stretch':     'hamstring stretch seated',
        'Étirement Ischios':     'hamstring stretch seated',
        'Quad Stretch':          'quad stretch standing',
        'Étirement Quadriceps':  'quad stretch standing',
        'Butterfly Stretch':     'butterfly stretch flexibility',
        'Papillon':              'butterfly stretch flexibility',
        'Shoulder Stretch':      'shoulder stretch cross body',
        'Étirement Épaules':     'shoulder stretch cross body',
        'Tricep Stretch':        'tricep stretch overhead',
        'Étirement Triceps':     'tricep stretch overhead',
        'Pigeon Pose':           'pigeon pose hip stretch yoga',
        'Pigeon':                'pigeon pose hip stretch yoga',
        'Inchworm':              'inchworm exercise warmup',
        'Hip Rotations':         'hip rotation mobility exercise',
        'Rotation des Hanches':  'hip rotation mobility exercise',
        'Slow Push-ups (4s)':    'slow pushup strength control',
        'Pompes Lentes (4s)':    'slow pushup strength control',
        'Jump Rope (sim.)':      'jump rope cardio fitness',
        'Saut à la Corde (sim)': 'jump rope cardio fitness',
        'Frog Jumps':            'frog jump squat explosive',
        'Isometric Squat':       'squat hold isometric legs',
        'Squat Isométrique':     'squat hold isometric legs',
        'Happy Baby':            'happy baby yoga floor',
        'Bébé Heureux':          'happy baby yoga floor',
        'Doorframe Row':         'resistance row back exercise',
        'Rameur Chaise':         'seated row back exercise',
        'Bear Crawl':            'bear crawl floor exercise',
        // Senior
        'Seated March':          'seated exercise elderly chair',
        'Marche Assise':         'seated exercise elderly chair',
        'Leg Extension':         'leg extension seated exercise',
        'Extension Jambe':       'leg extension seated exercise',
        'Shoulder Rolls':        'shoulder rolls mobility senior',
        'Rotation Épaules':      'shoulder rolls mobility senior',
        'Ankle Flexion':         'ankle flexion seated elderly',
        'Flexion Chevilles':     'ankle exercise seated elderly',
        'Torso Twist':           'torso twist seated exercise',
        'Rotation Buste':        'torso twist seated exercise',
        'Arm Raises':            'arm raise seated exercise',
        'Lever de Bras':         'arm raise seated exercise',
        'Hand Clenches':         'hand grip exercise elderly',
        'Serrer les Poings':     'hand grip exercise elderly',
        'Side Bends':            'side bend stretch seated',
        'Inclinaison Latérale':  'side bend stretch seated',
        'Knee Tap':              'coordination exercise seated elderly',
        'Toucher Genou Opposé':  'coordination exercise seated elderly',
        'Wall Push-ups':         'wall pushup senior exercise',
        'Pompes au Mur':         'wall pushup senior exercise',
        'Chair Squats':          'sit to stand senior exercise',
        'Squat Chaise':          'sit to stand senior exercise',
        'Single Leg Balance':    'balance training one leg elderly',
        'Équilibre 1 Jambe':     'balance training one leg elderly',
        'Heel Curls':            'heel curl standing exercise',
        'Talon-Fesse':           'heel curl standing exercise',
        'Side Leg Raise':        'side leg raise senior standing',
        'Élévation Latérale':    'side leg raise senior standing',
        'Hip Extension':         'hip extension standing senior',
        'Extension Hanche':      'hip extension standing senior',
        'Mini Lunges':           'mini lunge gentle exercise',
        'Mini Fentes':           'mini lunge gentle exercise',
        'Neck Rotation':         'neck stretch gentle senior',
        'Rotation du Cou':       'neck stretch gentle senior',
        'Head Turns (Yes/No)':   'neck mobility exercise gentle',
        'Oui-Non Tête':          'neck mobility exercise gentle',
        'Scapular Squeeze':      'posture exercise shoulder blades',
        'Serrer Omoplates':      'posture exercise shoulder blades',
        'Cat-Cow (Seated)':      'seated cat cow back stretch',
        'Dos Rond / Creux':      'seated cat cow back stretch',
        'Wrist Rotations':       'wrist rotation exercise hands',
        'Rotation Poignets':     'wrist rotation exercise hands',
        'Seated Row':            'seated row back exercise',
        'Rameur Assis':          'seated row back exercise',
        'Wall Sit':              'wall sit legs senior',
        'Chaise Appuyée':        'wall lean gentle leg exercise',
        'Toe Taps':              'toe tap coordination seated',
        'Tapements d\'Orteils':  'toe tap coordination seated',
        'March in Place':        'march in place senior cardio',
        'Marche sur Place':      'march in place senior cardio',
        'Side Steps':            'side step exercise senior',
        'Pas Chassés':           'side step exercise senior',
        'Tandem Walk':           'tandem walk balance exercise',
        'Marche Talon-Pointe':   'tandem walk balance exercise',
        'Arm Crosses':           'arm cross coordination exercise',
        'Croisement Bras':       'arm cross coordination exercise',
        'Shadow Boxing':         'shadow boxing senior cardio',
        'Boxe dans le vide':     'shadow boxing senior cardio',
    };
    return overrides[name] || `${name} exercise fitness`;
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

// ─── Serialize ────────────────────────────────────────────────────────────────
function serializeData(varName, data) {
    const lines = [];
    lines.push(`/* AUTO-GENERATED — do not edit manually */`);
    lines.push(`/* Re-run fetch-videos.js / fetch-images.js to refresh */\n`);
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
                `min: ${exo.min}`, `max: ${exo.max}`,
                `unit: ${JSON.stringify(exo.unit)}`,
                `emoji: ${JSON.stringify(exo.emoji)}`,
                `type: ${JSON.stringify(exo.type)}`,
            ];
            if (exo.desc)    fields.push(`desc: ${JSON.stringify(exo.desc)}`);
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

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const frPath = path.join(__dirname, 'js/data-fr.js');
    const enPath = path.join(__dirname, 'js/data-en.js');
    const { varName: varFR, data: dataFR } = loadData(frPath);
    const { varName: varEN, data: dataEN } = loadData(enPath);

    let total = 0, found = 0, skipped = 0;

    for (const section of ['intense', 'senior']) {
        console.log(`\n════════════════════════════════`);
        console.log(`📂 Section: ${section}`);
        console.log(`════════════════════════════════`);

        for (let i = 0; i < dataEN[section].length; i++) {
            const exoEN = dataEN[section][i];
            const exoFR = dataFR[section][i];
            total++;

            const filename = toFilename(exoEN.name);
            const destPath = path.join(IMAGES_DIR, filename);
            const localUrl = `images/exercises/${filename}`;

            // Skip if already downloaded
            if (fs.existsSync(destPath)) {
                exoEN.img = localUrl;
                exoFR.img = localUrl;
                skipped++;
                found++;
                console.log(`  [${total}] ${exoEN.name} ... ⏭ skipped`);
                continue;
            }

            process.stdout.write(`  [${total}] ${exoEN.name} ... `);

            const query      = buildQuery(exoEN.name);
            const sourceUrl  = buildUnsplashUrl(query);

            try {
                await downloadImage(sourceUrl, destPath);
                exoEN.img = localUrl;
                exoFR.img = localUrl;
                found++;
                const size = Math.round(fs.statSync(destPath).size / 1024);
                console.log(`✓ ${filename} (${size}KB)`);
            } catch (e) {
                console.log(`✗ ${e.message}`);
                // Clean up partial file
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            }

            await delay(DELAY_MS);
        }
    }

    // Save both data files
    fs.writeFileSync(frPath, serializeData(varFR, dataFR), 'utf8');
    fs.writeFileSync(enPath, serializeData(varEN, dataEN), 'utf8');

    console.log(`\n✅ ${found}/${total} images downloaded (${skipped} skipped)`);
    console.log(`📁 Images saved to: images/exercises/`);
    console.log(`\n💡 To replace a bad photo:`);
    console.log(`   Drop a new .jpg into images/exercises/ with the same filename`);
    console.log(`   Then run: git add . && git commit -m "update images" && git push`);
}

main().catch(console.error);
