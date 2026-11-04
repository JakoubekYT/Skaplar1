(() => {
  const SIZE = { S: 48, M: 72, L: 96 };
  const SIZE_NAME = { S: 'malý', M: 'střední', L: 'velký' };
  const SIZE_SCALE = { S: 1, M: 1.5, L: 2 };
  const BAT_SIZES = [['S', 'Malá'], ['M', 'Střední'], ['L', 'Velká']];

  const BASE = [
    { name: 'Srdeční tep', desc: 'Optický senzor tepu' },
    { name: 'Spánkové fáze', desc: 'Teplotní senzor NTC' },
    { name: 'Gesta', desc: 'Senzor pohybu ruky' },
    { name: 'Bluetooth Low Energy', desc: 'Spojení s telefonem' },
    { name: 'Bezdrátové nabíjení' },
    { name: 'Baterie' },
  ];

  const MODULES = [
    { key: 'nfc', code: 'NFC', size: 'S', name: 'Platby NFC', desc: 'Bezkontaktní placení zápěstím.' },
    { key: 'vib', code: 'VIB', size: 'S', name: 'Vibrace', desc: 'Hmatová odezva, třeba tichý budík.' },
    { key: 'uvb', code: 'UVB', size: 'S', name: 'Sledování UVB', desc: 'Hlídá UVB záření ze slunce.' },
    { key: 'alt', code: 'ALT', size: 'S', name: 'Výškoměr', desc: 'Nadmořská výška.' },
    { key: 'bia', code: 'BIA', size: 'M', name: 'BIA senzor', desc: 'Bioimpedance pro úroveň stresu.' },
    { key: 'gps', code: 'GPS', size: 'M', name: 'GPS', desc: 'Poloha a záznam trasy.' },
    { key: 'sol', code: 'SOL', size: 'M', name: 'Solární nabíjení', desc: 'Dobíjení ze světla.' },
    { key: 'sat', code: 'SAT', size: 'L', name: 'Satelitní komunikace', desc: 'Spojení i mimo mobilní signál.' },
  ];

  const BATTERY = { code: 'BAT', name: 'Přídavná baterie', desc: 'Delší výdrž na jedno nabití.' };

  const CUSTOM_DESC = 'Vaše sestava. Moduly přidáte kliknutím a sestava zůstane uložená, i když mezitím přepnete na ukázku.';

  const PRESETS = [
    { id: 'base', label: 'Jen základ', desc: 'Jen základní článek: tep, spánkové fáze, gesta a spojení s telefonem.', mods: [], bat: null },
    { id: 'watch', label: 'Vedle hodinek', desc: 'Na druhou ruku ke klasickým hodinkám: placení zápěstím a tichý budík vibrací.', mods: ['nfc', 'vib'], bat: null },
    { id: 'summer', label: 'Léto', desc: 'Placení bez telefonu, hlídání UVB záření a delší výdrž.', mods: ['nfc', 'uvb'], bat: 'M' },
    { id: 'hills', label: 'Hory', desc: 'Poloha, nadmořská výška, spojení mimo signál a dobíjení ze slunce.', mods: ['gps', 'alt', 'sat', 'sol'], bat: 'L' },
    { id: 'all', label: 'Všechno', desc: 'Všechny moduly a velká baterie.', mods: MODULES.map((m) => m.key), bat: 'L' },
  ].map((p) => ({ ...p, mods: new Set(p.mods) }));

  const HERO = [
    ['sol', 'grey'], ['gps', 'black'], ['nfc', 'grey'], ['vib', 'black'], ['base', 'black'],
    ['uvb', 'grey'], ['bia', 'black'], ['alt', 'grey'], ['sat', 'black'], ['bat:L', 'grey'],
  ];

  const H = 56;
  const G = 16;
  const PAD_X = 24;
  const PAD_Y = 22;
  const RING_Y = [12, 21, 30, 39];

  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  function s(tag, attrs = {}, text) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text) el.textContent = text;
    return el;
  }

  function h(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function plural(n, one, few, many) {
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
  }

  function specFor(key) {
    if (key === 'base') return { len: SIZE.L, label: 'ZÁKLAD', base: true };
    if (key.startsWith('bat:')) return { len: SIZE[key.slice(4)], label: BATTERY.code };
    const mod = MODULES.find((m) => m.key === key);
    return { len: SIZE[mod.size], label: mod.code };
  }

  function buildLink(key, color) {
    const { len: L, label, base } = specFor(key);
    const g = s('g', { class: `link c-${color}${base ? ' is-base' : ''}` });
    const inner = s('g', { class: 'link__in' });

    inner.append(
      s('rect', { class: 'j-clip', x: L - 2, y: 4, width: G - 1, height: H - 8, rx: 3 }),
      s('rect', { class: 'j-neck', x: -6, y: 13, width: 8, height: H - 26 }),
      s('rect', { class: 'j-cyl', x: -G + 3, y: 7, width: 9, height: H - 14, rx: 4.5 }),
      ...RING_Y.map((y) => s('rect', { class: 'j-ring', x: -G + 2, y, width: 11, height: 2.5, rx: 1 })),
      s('rect', { class: 'l-body', x: 0, y: 0, width: L, height: H, rx: 10 }),
      s('rect', { class: 'l-bevel', x: 3, y: 3, width: L - 6, height: H - 6, rx: 7.5 }),
      s('text', { class: 'l-text', x: L / 2, y: H / 2 + (base ? 3.5 : 4), 'text-anchor': 'middle' }, label)
    );

    g.append(inner);
    return g;
  }

  /* theme */

  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    if (theme === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    themeMeta.setAttribute('content', theme === 'dark' ? '#0b1416' : '#ffffff');
  }

  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('skaplar-theme', next);
  });

  /* hero: links hung on a circle, each one a rigid chord between two hinge points */

  function renderHero() {
    const svg = document.getElementById('heroChain');
    const R = 900;
    const group = s('g');
    svg.append(group);

    const deltas = HERO.map(([key]) => 2 * Math.asin((specFor(key).len + G) / (2 * R)));
    const point = (phi) => ({ x: R * Math.sin(phi), y: R * Math.cos(phi) });
    let phi = -deltas.reduce((a, b) => a + b, 0) / 2;

    HERO.forEach(([key, color], i) => {
      const a = point(phi);
      const b = point(phi + deltas[i]);
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const node = buildLink(key, color);
      node.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${angle}) translate(${G / 2} ${-H / 2})`);
      node.firstChild.style.setProperty('--i', i);
      group.append(node);
      phi += deltas[i];
    });

    const bb = group.getBBox();
    svg.setAttribute('viewBox', `${bb.x - 12} ${bb.y - 12} ${bb.width + 24} ${bb.height + 24}`);
  }

  renderHero();

  /* builder */

  const svg = document.getElementById('chain');
  const wrap = document.getElementById('chainWrap');
  const readout = document.getElementById('readout');
  const stageName = document.getElementById('stageName');
  const baseList = document.getElementById('baseList');
  const modsBox = document.getElementById('mods');
  const modGrid = document.getElementById('modGrid');
  const modsHint = document.getElementById('modsHint');
  const setOwnBox = document.getElementById('setOwn');
  const setPresetBox = document.getElementById('setPresets');
  const setDesc = document.getElementById('setDesc');
  const adoptBtn = document.getElementById('adopt');

  const nodes = new Map();
  const cards = new Map();
  const sizeButtons = new Map();
  const presetButtons = new Map();
  let batCard;
  let batBar;
  let ownBtn;
  let ownCount;

  let view = 'custom';
  const custom = loadCustom();

  function loadCustom() {
    const set = { mods: new Set(), bat: null };
    const raw = store.get('skaplar-sestava');
    if (!raw) return set;
    try {
      const data = JSON.parse(raw);
      (data.mods || []).forEach((k) => { if (MODULES.some((m) => m.key === k)) set.mods.add(k); });
      if (SIZE[data.bat]) set.bat = data.bat;
    } catch (e) { /* ignore a broken saved set */ }
    return set;
  }

  function saveCustom() {
    store.set('skaplar-sestava', JSON.stringify({ mods: [...custom.mods], bat: custom.bat }));
  }

  const isLocked = () => view !== 'custom';
  const activeSet = () => (view === 'custom' ? custom : PRESETS.find((p) => p.id === view));
  const countOf = (set) => set.mods.size + (set.bat ? 1 : 0);

  function keysOf(set) {
    return ['base', ...MODULES.filter((m) => set.mods.has(m.key)).map((m) => m.key), ...(set.bat ? [`bat:${set.bat}`] : [])];
  }

  function nextNodeAfter(key, keys) {
    for (let i = keys.indexOf(key) + 1; i < keys.length; i++) {
      const n = nodes.get(keys[i]);
      if (n) return n;
    }
    return null;
  }

  function sync(animate) {
    const keys = keysOf(activeSet());
    const motion = animate && !reduceMotion.matches;

    for (const [key, node] of nodes) {
      if (keys.includes(key)) continue;
      nodes.delete(key);
      if (!motion) {
        node.remove();
        continue;
      }
      node.classList.add('is-leaving');
      node.addEventListener('animationend', () => node.remove(), { once: true });
      setTimeout(() => node.remove(), 400);
    }

    const fresh = [];
    for (const key of keys) {
      if (nodes.has(key)) continue;
      const node = buildLink(key, 'black');
      nodes.set(key, node);
      fresh.push(node);
      svg.insertBefore(node, nextNodeAfter(key, keys));
      if (motion) {
        node.classList.add('is-entering');
        node.addEventListener('animationend', () => node.classList.remove('is-entering'), { once: true });
      }
    }

    layout(keys, fresh, !animate);
    updateUI(keys);
    if (motion && fresh.length === 1) revealLink(fresh[0]);
  }

  function layout(keys = keysOf(activeSet()), fresh = [], instant = false) {
    const lens = keys.map((k) => specFor(k).len);
    const chainW = lens.reduce((sum, len) => sum + len + G, 0) + G + PAD_X * 2;
    const style = getComputedStyle(wrap);
    const avail = wrap.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const kPref = avail < 640 ? 0.9 : 1.5;
    const kMin = 0.62;

    const vw = Math.max(avail / kPref, chainW);
    const vh = H + PAD_Y * 2;
    const pxW = avail / vw < kMin ? vw * kMin : avail;

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    svg.setAttribute('width', pxW);
    svg.setAttribute('height', (vh * pxW) / vw);

    let x = (vw - chainW) / 2 + PAD_X + G;
    keys.forEach((key, i) => {
      const node = nodes.get(key);
      const t = `translate(${x}px, ${PAD_Y}px)`;
      if (instant || fresh.includes(node)) {
        node.style.transition = 'none';
        node.style.transform = t;
        node.getBoundingClientRect();
        node.style.transition = '';
      } else {
        node.style.transform = t;
      }
      x += lens[i] + G;
    });

    updateFade();
  }

  function revealLink(node) {
    const r = node.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    if (r.left >= w.left && r.right <= w.right) return;
    wrap.scrollBy({ left: r.left - w.left - (w.width - r.width) / 2, behavior: 'smooth' });
  }

  function updateFade() {
    const max = wrap.scrollWidth - wrap.clientWidth;
    wrap.classList.toggle('fade-l', max > 1 && wrap.scrollLeft > 2);
    wrap.classList.toggle('fade-r', max > 1 && wrap.scrollLeft < max - 2);
  }

  function updateUI(keys) {
    const set = activeSet();
    const locked = isLocked();
    const preset = locked ? set : null;

    const n = keys.length;
    const m = n - 1;
    const links = `${n} ${plural(n, 'článek', 'články', 'článků')}`;
    readout.textContent = m === 0 ? `${links} · jen základ` : `${links} · základ + ${m} ${plural(m, 'modul', 'moduly', 'modulů')}`;
    stageName.textContent = preset ? `Ukázka: ${preset.label}` : 'Vlastní sestava';

    const names = ['základ', ...MODULES.filter((x) => set.mods.has(x.key)).map((x) => x.name)];
    if (set.bat) names.push(`${BATTERY.name} (${BAT_SIZES.find(([k]) => k === set.bat)[1].toLowerCase()})`);
    svg.setAttribute('aria-label', `Náramek: ${names.join(', ')}`);

    const own = countOf(custom);
    ownBtn.setAttribute('aria-pressed', String(!locked));
    ownCount.textContent = String(own);
    ownCount.hidden = own === 0;
    for (const [id, btn] of presetButtons) btn.setAttribute('aria-pressed', String(view === id));

    setDesc.textContent = preset ? preset.desc : CUSTOM_DESC;
    adoptBtn.hidden = !locked;
    adoptBtn.textContent = own > 0 ? 'Nahradit vlastní sestavu touto' : 'Upravit jako vlastní';

    modsBox.classList.toggle('is-locked', locked);
    modsHint.textContent = locked ? 'Ukázku nelze upravit. Moduly měníte ve vlastní sestavě.' : 'Kliknutím modul přidáte nebo odeberete.';

    for (const [key, card] of cards) {
      const on = set.mods.has(key);
      card.classList.toggle('is-on', on);
      card.setAttribute('aria-pressed', String(on));
      if (locked) card.setAttribute('aria-disabled', 'true');
      else card.removeAttribute('aria-disabled');
    }

    batCard.classList.toggle('is-on', Boolean(set.bat));
    batBar.style.setProperty('--s', set.bat ? SIZE_SCALE[set.bat] : 1);
    for (const [size, btn] of sizeButtons) {
      btn.setAttribute('aria-pressed', String(set.bat === size));
      btn.disabled = locked;
    }
  }

  function sizeBar(scale) {
    const bar = h('span', 'mod__size');
    bar.style.setProperty('--s', scale);
    bar.setAttribute('aria-hidden', 'true');
    return bar;
  }

  function stateIcon() {
    const state = h('span', 'mod__state');
    state.setAttribute('aria-hidden', 'true');
    const icon = s('svg', { viewBox: '0 0 12 12' });
    icon.append(s('path', { class: 'i-plus', d: 'M6 1.5v9M1.5 6h9' }), s('path', { class: 'i-check', d: 'M2 6.4l2.6 2.6L10 3.2' }));
    state.append(icon);
    return state;
  }

  for (const item of BASE) {
    const li = h('li');
    const name = h('span', 'base__name', item.name);
    if (item.desc) name.append(h('span', 'base__desc', item.desc));
    li.append(name);
    baseList.append(li);
  }

  for (const mod of MODULES) {
    const btn = h('button', 'mod');
    btn.type = 'button';
    const code = h('span', 'mod__code');
    code.append(sizeBar(SIZE_SCALE[mod.size]), `${mod.code} · ${SIZE_NAME[mod.size]}`);
    btn.append(code, stateIcon(), h('span', 'mod__name', mod.name), h('span', 'mod__desc', mod.desc));
    btn.addEventListener('click', () => {
      if (isLocked()) return;
      if (custom.mods.has(mod.key)) custom.mods.delete(mod.key);
      else custom.mods.add(mod.key);
      saveCustom();
      sync(true);
    });
    cards.set(mod.key, btn);
    modGrid.append(btn);
  }

  batCard = h('div', 'mod mod--bat');
  batCard.setAttribute('role', 'group');
  batCard.setAttribute('aria-labelledby', 'batName');
  const batCode = h('span', 'mod__code');
  batBar = sizeBar(1);
  batCode.append(batBar, `${BATTERY.code} · 3 velikosti`);
  const batName = h('span', 'mod__name', BATTERY.name);
  batName.id = 'batName';
  const sizes = h('div', 'sizes');
  for (const [size, label] of BAT_SIZES) {
    const btn = h('button', 'size', label);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      if (isLocked()) return;
      custom.bat = custom.bat === size ? null : size;
      saveCustom();
      sync(true);
    });
    sizeButtons.set(size, btn);
    sizes.append(btn);
  }
  batCard.append(batCode, stateIcon(), batName, h('span', 'mod__desc', BATTERY.desc), sizes);
  modGrid.append(batCard);

  ownBtn = h('button', 'set set--own', 'Vlastní');
  ownBtn.type = 'button';
  ownCount = h('span', 'set__count');
  ownBtn.append(ownCount);
  ownBtn.addEventListener('click', () => {
    view = 'custom';
    sync(true);
  });
  setOwnBox.append(ownBtn);

  for (const preset of PRESETS) {
    const btn = h('button', 'set', preset.label);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      view = preset.id;
      sync(true);
    });
    presetButtons.set(preset.id, btn);
    setPresetBox.append(btn);
  }

  adoptBtn.addEventListener('click', () => {
    const preset = activeSet();
    custom.mods = new Set(preset.mods);
    custom.bat = preset.bat;
    view = 'custom';
    saveCustom();
    sync(true);
  });

  wrap.addEventListener('scroll', updateFade, { passive: true });

  let raf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => layout(undefined, [], true));
  }).observe(wrap);

  sync(false);
})();
