// Leonida Legend — GTA 6 trophy guide & tracker.
// Checklist state lives in localStorage; the trophy data is fetched once from
// data/trophies.json (a file inside app/, so the guide works fully offline).
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';
const DEFAULT_DETAIL_ID = 28; // Positive Mental Attitude, the one missable trophy.

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const statusEl = document.getElementById('status');
const missableEl = document.getElementById('missableOnly');
const spoilersEl = document.getElementById('spoilers');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((n) => trophies.some((t) => t.name === n)));
} catch {
  earned = new Set();
}
let hideSpoilers = localStorage.getItem(SPOILER_KEY) !== 'off';
spoilersEl.checked = hideSpoilers;

let selectedId = byId.has(DEFAULT_DETAIL_ID) ? DEFAULT_DETAIL_ID : trophies[0].id;

// Deep-linkable filters for screenshots and sharing: ?grade=silver&kind=story&q=bank
const params = new URLSearchParams(location.search);
if (params.get('grade') && [...gradeEl.options].some((o) => o.value === params.get('grade'))) gradeEl.value = params.get('grade');
if (params.get('kind') && [...kindEl.options].some((o) => o.value === params.get('kind'))) kindEl.value = params.get('kind');
if (params.get('q')) searchEl.value = params.get('q');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function saveSpoilers() {
  localStorage.setItem(SPOILER_KEY, hideSpoilers ? 'on' : 'off');
}
function isHidden(t) {
  return t.hidden && hideSpoilers && !earned.has(t.name);
}
function gradeLabel(g) {
  return g[0].toUpperCase() + g.slice(1);
}
function kindLabel(k) {
  return { story: 'Story', completion: 'Completion', collectible: 'Collectible', activity: 'Activity', misc: 'Misc' }[k] ?? k;
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (statusEl.value === 'earned' && !earned.has(t.name)) return false;
    if (statusEl.value === 'remaining' && earned.has(t.name)) return false;
    if (missableEl.checked && !t.missable) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function tag(text, cls) {
  const s = document.createElement('span');
  s.className = 'tag' + (cls ? ' ' + cls : '');
  s.textContent = text;
  return s;
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  document.getElementById('progressText').textContent = `${n} of ${total} earned — ${pct}% to the platinum`;
  const perGrade = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
    return `${gradeLabel(g)} ${got}/${all}`;
  }).join(' · ');
  document.getElementById('progressGrades').textContent = perGrade;
  document.getElementById('progressFill').style.width = pct + '%';
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', String(n));
}

function renderList() {
  const list = visibleTrophies();
  document.getElementById('listMeta').textContent =
    `Showing ${list.length} of ${trophies.length} trophies` +
    (earned.size ? ` — ${earned.size} earned` : ' — tick a trophy to mark it earned');
  rowsEl.replaceChildren();
  for (const t of list) {
    const li = document.createElement('li');
    li.className = 'trophy-row' + (earned.has(t.name) ? ' earned' : '') + (t.id === selectedId ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Mark ' + (isHidden(t) ? 'hidden trophy' : t.name) + ' earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      renderAll();
    });
    box.addEventListener('click', (e) => e.stopPropagation());
    const main = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = isHidden(t) ? 'Hidden Trophy' : t.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = isHidden(t) ? 'Hidden on PlayStation until earned.' : t.description;
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    tags.append(tag(kindLabel(t.kind)));
    if (t.hidden) tags.append(tag('Hidden', 'hidden-flag'));
    if (t.missable) tags.append(tag('⚠ Missable', 'missable'));
    if (typeof t.count === 'number') tags.append(tag('× ' + t.count.toLocaleString('en-US'), 'count'));
    main.append(name, desc, tags);
    const badge = document.createElement('span');
    badge.className = 'grade-badge grade-' + t.grade;
    badge.textContent = gradeLabel(t.grade);
    li.append(box, main, badge);
    li.addEventListener('click', () => {
      selectedId = t.id;
      renderAll();
      detailEl.scrollIntoView({ block: 'nearest' });
    });
    rowsEl.append(li);
  }
}

function renderDetail() {
  const t = byId.get(selectedId) ?? trophies[0];
  detailEl.replaceChildren();
  const badge = document.createElement('span');
  badge.className = 'grade-badge grade-' + t.grade;
  badge.textContent = gradeLabel(t.grade);
  detailEl.append(badge);
  const h = document.createElement('h2');
  h.textContent = isHidden(t) ? 'Hidden Trophy' : t.name;
  detailEl.append(h);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = isHidden(t)
    ? 'This trophy is hidden on PlayStation until you earn it. Tick it off in the list to reveal it here.'
    : '“' + t.description + '” — official PlayStation description.';
  detailEl.append(official);
  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  tags.append(tag(kindLabel(t.kind)));
  if (t.hidden) tags.append(tag('Hidden', 'hidden-flag'));
  if (t.missable) tags.append(tag('⚠ Missable', 'missable'));
  if (typeof t.count === 'number') tags.append(tag('Target: ' + t.count.toLocaleString('en-US'), 'count'));
  detailEl.append(tags);
  if (isHidden(t)) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Spoilers are hidden. Earn this trophy (or turn off “Hide spoilers” above) to read its guide.';
    detailEl.append(note);
  } else {
    if (t.missable) {
      const warn = document.createElement('div');
      warn.className = 'warn';
      const strong = document.createElement('strong');
      strong.textContent = '⚠ Possibly missable — read before Chapter 1 ends. ';
      warn.append(strong, document.createTextNode('There is no mission replay, so keep a manual save at the start of every chapter.'));
      detailEl.append(warn);
    }
    const guide = document.createElement('div');
    guide.className = 'guide';
    for (const para of t.guide.split('\n')) {
      const p = document.createElement('p');
      p.textContent = para;
      guide.append(p);
    }
    detailEl.append(guide);
    if (t.sources && t.sources.length) {
      const src = document.createElement('p');
      src.className = 'sources';
      src.append(document.createTextNode('Sources for this guide: '));
      t.sources.forEach((s, i) => {
        if (i) src.append(document.createTextNode(' · '));
        if (s.url) {
          const a = document.createElement('a');
          a.href = s.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = s.name;
          src.append(a);
        } else {
          src.append(document.createTextNode(s.name));
        }
      });
      detailEl.append(src);
    }
  }
  const earnRow = document.createElement('label');
  earnRow.className = 'earn-row';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    renderAll();
  });
  earnRow.append(box, document.createTextNode(earned.has(t.name) ? 'Earned ✓' : 'Mark as earned'));
  detailEl.append(earnRow);
}

function renderSources() {
  const ul = document.getElementById('sources');
  ul.replaceChildren();
  for (const s of doc.sources ?? []) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      li.append(a);
    } else {
      li.textContent = s.name;
    }
    ul.append(li);
  }
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    earned = new Set(names.filter((n) => trophies.some((t) => t.name === n)));
    save();
    renderAll();
  } catch {
    alert('That file is not a valid trophy-progress export.');
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!earned.size || confirm('Clear all earned trophies?')) {
    earned = new Set();
    save();
    renderAll();
  }
});
spoilersEl.addEventListener('change', () => {
  hideSpoilers = spoilersEl.checked;
  saveSpoilers();
  renderAll();
});
for (const el of [searchEl, gradeEl, kindEl, statusEl, missableEl]) {
  el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', renderAll);
}

renderSources();
renderAll();
