/* =============================================
   Quick Sport App — app.js
   Bilingual (FR/EN) + YouTube embed
   ============================================= */

const YT_API_KEY = 'AIzaSyAitxZc5k36HZeXNa24fy-lwXL0kvYekpM';
const videoCache = {};   // "lang:name" → videoId

let currentLang = 'fr';
let currentMode = null;

/* ─── INIT ───────────────────────────────────── */
window.onload = function () {
    const lang = localStorage.getItem('qsa_lang') || 'fr';
    setLang(lang, true);
};

/* ─── LANGUAGE ───────────────────────────────── */
function setLang(lang, restoreMode = false) {
    currentLang = lang;
    localStorage.setItem('qsa_lang', lang);
    document.documentElement.lang = lang;

    // Sync all four lang buttons
    document.getElementById('btn-fr').classList.toggle('active',      lang === 'fr');
    document.getElementById('btn-en').classList.toggle('active',      lang === 'en');
    document.getElementById('btn-fr-home').classList.toggle('active', lang === 'fr');
    document.getElementById('btn-en-home').classList.toggle('active', lang === 'en');

    const ui = (lang === 'fr' ? dataFR : dataEN).ui;

    document.getElementById('txt-choose').textContent        = ui.choose;
    document.getElementById('txt-intense-title').textContent = ui.intenseTitle;
    document.getElementById('txt-intense-desc').innerHTML    = ui.intenseDesc;
    document.getElementById('txt-senior-title').textContent  = ui.seniorTitle;
    document.getElementById('txt-senior-desc').innerHTML     = ui.seniorDesc;
    document.getElementById('txt-change').textContent        = ui.change;
    document.getElementById('txt-next').textContent          = ui.next;

    if (restoreMode) {
        const saved = localStorage.getItem('qsa_mode');
        if (saved) setMode(saved);
    } else if (currentMode) {
        generateWorkout();
    }
}

/* ─── SCREEN HELPERS ─────────────────────────── */
function showWorkoutUI() {
    document.getElementById('selection-screen').style.display  = 'none';
    document.getElementById('lang-switcher-home').style.display = 'none';
    document.getElementById('top-bar').style.display           = 'flex';
    document.getElementById('workout-screen').style.display    = 'block';
    document.getElementById('txt-next').style.display          = 'block';
}

function showSelectionUI() {
    document.getElementById('workout-screen').style.display    = 'none';
    document.getElementById('top-bar').style.display           = 'none';
    document.getElementById('txt-next').style.display          = 'none';
    document.getElementById('selection-screen').style.display  = 'flex';
    document.getElementById('lang-switcher-home').style.display = 'flex';
    resetVideo();
}

/* ─── MODE ───────────────────────────────────── */
function setMode(mode) {
    currentMode = mode;
    localStorage.setItem('qsa_mode', mode);

    const c = document.querySelector('body');
    c.classList.remove('theme-intense', 'theme-senior');
    c.classList.add(mode === 'intense' ? 'theme-intense' : 'theme-senior');

    showWorkoutUI();
    generateWorkout();
}

function clearMode() {
    localStorage.removeItem('qsa_mode');
    currentMode = null;
    document.querySelector('body').classList.remove('theme-intense', 'theme-senior');
    showSelectionUI();
}

/* ─── EXERCISE GENERATOR ─────────────────────── */
function generateWorkout() {
    const data = currentLang === 'fr' ? dataFR : dataEN;
    const list = currentMode === 'intense' ? data.intense : data.senior;
    const exo  = list[Math.floor(Math.random() * list.length)];

    let count;
    if (exo.unit.includes('sec')) {
        const raw = Math.floor(Math.random() * (exo.max - exo.min + 1)) + exo.min;
        count = Math.ceil(raw / 5) * 5;
    } else {
        count = Math.floor(Math.random() * (exo.max - exo.min + 1)) + exo.min;
    }

    document.getElementById('emoji').textContent = exo.emoji;
    document.getElementById('type').textContent  = exo.type;
    document.getElementById('name').textContent  = exo.name;
    document.getElementById('reps').textContent  = count + ' ' + exo.unit;

    const noteEl = document.getElementById('note');
    if (exo.note) {
        noteEl.textContent    = exo.note;
        noteEl.style.display  = 'block';
    } else {
        noteEl.style.display  = 'none';
    }

    loadVideo(exo.name);
}

/* ─── YOUTUBE ────────────────────────────────── */
async function loadVideo(exerciseName) {
    resetVideo();
    showLoader(true);

    const key = currentLang + ':' + exerciseName;
    if (videoCache[key]) { embedVideo(videoCache[key]); return; }

    const q = currentLang === 'fr'
        ? `comment faire ${exerciseName}${currentMode === 'senior' ? ' senior' : ' exercice'}`
        : `how to do ${exerciseName}${currentMode === 'senior' ? ' senior exercise' : ' workout'}`;

    try {
        const url  = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(q)}&key=${YT_API_KEY}`;
        const res  = await fetch(url);
        const json = await res.json();

        if (json.items && json.items.length > 0) {
            const id = json.items[0].id.videoId;
            videoCache[key] = id;
            embedVideo(id);
        } else {
            showFallback(exerciseName);
        }
    } catch (e) {
        console.error('YT API error', e);
        showFallback(exerciseName);
    }
}

function embedVideo(videoId) {
    showLoader(false);
    document.getElementById('yt-iframe').src =
        `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    document.getElementById('video-embed').style.display = 'block';
}

function showLoader(on) {
    const ui = (currentLang === 'fr' ? dataFR : dataEN).ui;
    const el = document.getElementById('video-loader');
    el.textContent = ui.videoSearching || '🔍 Searching...';
    el.classList.toggle('searching', on);
    el.style.display = on ? 'block' : 'none';
}

function showFallback(exerciseName) {
    showLoader(false);
    const ui = (currentLang === 'fr' ? dataFR : dataEN).ui;
    const q  = currentLang === 'fr'
        ? `comment faire ${exerciseName} exercice`
        : `how to do ${exerciseName} workout`;
    const a  = document.getElementById('yt-fallback');
    a.href        = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
    a.textContent = ui.video || '▶ Watch on YouTube';
    a.style.display = 'inline-block';
    document.getElementById('video-embed').style.display = 'block';
}

function resetVideo() {
    showLoader(false);
    document.getElementById('yt-iframe').src    = '';
    document.getElementById('video-embed').style.display  = 'none';
    document.getElementById('yt-fallback').style.display  = 'none';
}
