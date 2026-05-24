/* =============================================
   Workout YeahVibe — app.js
   v1.3.0 — 2025-05
   Changelog:
   v1.3.0 — favicon, OG image, SEO, Happybein icon, accessibility
   v1.2.0 — collapsible description, compact card layout
   v1.1.0 — YouTube video embed, hardcoded videoIds
   v1.0.0 — initial bilingual FR/EN release
   ============================================= */

const APP_VERSION = '1.3.0';

const YT_API_KEY = 'AIzaSyAitxZc5k36HZeXNa24fy-lwXL0kvYekpM';
const videoCache = {};

let currentLang = 'fr';
let currentMode = null;

window.onload = function () {
    const lang = localStorage.getItem('qsa_lang') || 'fr';
    setLang(lang, true);
};

function setLang(lang, restoreMode = false) {
    currentLang = lang;
    localStorage.setItem('qsa_lang', lang);
    document.documentElement.lang = lang;

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

function showWorkoutUI() {
    document.getElementById('selection-screen').style.display   = 'none';
    document.getElementById('lang-switcher-home').style.display = 'none';
    document.getElementById('top-bar').style.display            = 'flex';
    document.getElementById('workout-screen').style.display     = 'block';
    document.getElementById('txt-next').style.display           = 'block';
}

function showSelectionUI() {
    document.getElementById('workout-screen').style.display     = 'none';
    document.getElementById('top-bar').style.display            = 'none';
    document.getElementById('txt-next').style.display           = 'none';
    document.getElementById('selection-screen').style.display   = 'flex';
    document.getElementById('lang-switcher-home').style.display = 'flex';
    resetVideo();
}

function setMode(mode) {
    currentMode = mode;
    localStorage.setItem('qsa_mode', mode);
    document.querySelector('body').classList.remove('theme-intense', 'theme-senior');
    document.querySelector('body').classList.add(mode === 'intense' ? 'theme-intense' : 'theme-senior');
    showWorkoutUI();
    generateWorkout();
}

function clearMode() {
    localStorage.removeItem('qsa_mode');
    currentMode = null;
    document.querySelector('body').classList.remove('theme-intense', 'theme-senior');
    showSelectionUI();
}

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
        noteEl.textContent   = exo.note;
        noteEl.style.display = 'block';
    } else {
        noteEl.style.display = 'none';
    }

    if (exo.videoId) {
        embedVideo(exo.videoId);
    } else {
        loadVideoFromAPI(exo.name);
    }
}

function embedVideo(videoId) {
    resetVideo();
    const iframe = document.getElementById('yt-iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

    const below = document.getElementById('yt-fallback-below');
    const ui    = (currentLang === 'fr' ? dataFR : dataEN).ui;
    below.href        = `https://www.youtube.com/watch?v=${videoId}`;
    below.textContent = ui.video || '▶ Watch on YouTube';
    iframe.onload = function () { below.style.display = 'block'; };

    document.getElementById('video-embed').style.display = 'block';
}

async function loadVideoFromAPI(exerciseName) {
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
        showFallback(exerciseName);
    }
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
    a.href          = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
    a.textContent   = ui.video || '▶ Watch on YouTube';
    a.style.display = 'inline-block';
    document.getElementById('video-embed').style.display = 'block';
}

function resetVideo() {
    showLoader(false);
    const iframe = document.getElementById('yt-iframe');
    iframe.onload = null;
    iframe.src = '';
    document.getElementById('video-embed').style.display       = 'none';
    document.getElementById('yt-fallback').style.display       = 'none';
    document.getElementById('yt-fallback-below').style.display = 'none';
}
