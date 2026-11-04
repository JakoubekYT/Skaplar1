(() => {
  const SIZE = { S: 48, M: 72, L: 96 };
  const SIZE_NAME = { S: 'malý', M: 'střední', L: 'velký' };
  const SIZE_SCALE = { S: 1, M: 1.5, L: 2 };
  const SIZES = ['S', 'M', 'L'];
  const BAT_LABEL = { S: 'Malá', M: 'Střední', L: 'Velká' };
  const BAT_ACC = { S: 'malou', M: 'střední', L: 'velkou' };
  const BAT_MAX = 3;

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

  const BATTERY = { code: 'BAT', name: 'Přídavná baterie', desc: `Delší výdrž. Přidat jde i víc baterií, od každé velikosti až ${BAT_MAX}.` };

  const CUSTOM_DESC = 'Vaše sestava. Moduly přidáte kliknutím a sestava zůstane uložená, i když mezitím přepnete na ukázku.';

  const PRESETS = [
    { id: 'base', label: 'Jen základ', desc: 'Jen základní článek: tep, spánkové fáze, gesta a spojení s telefonem.', mods: [], bats: {} },
    { id: 'watch', label: 'Vedle hodinek', desc: 'Na druhou ruku ke klasickým hodinkám: placení zápěstím a tichý budík vibrací.', mods: ['nfc', 'vib'], bats: {} },
    { id: 'summer', label: 'Léto', desc: 'Placení bez telefonu, hlídání UVB záření a dvě malé baterie navíc.', mods: ['nfc', 'uvb'], bats: { S: 2 } },
    { id: 'hills', label: 'Hory', desc: 'Poloha, nadmořská výška, spojení mimo signál a dobíjení ze slunce.', mods: ['gps', 'alt', 'sat', 'sol'], bats: { L: 1 } },
    { id: 'all', label: 'Všechno', desc: 'Všechny moduly a baterie ve všech třech velikostech.', mods: MODULES.map((m) => m.key), bats: { S: 1, M: 1, L: 1 } },
  ].map((p) => ({ ...p, mods: new Set(p.mods), bats: { S: 0, M: 0, L: 0, ...p.bats } }));

  const H = 56;
  const G = 8;
  const PLATE_H = 20;
  const PLATE_IN = 7;
  const TONGUE = G + PLATE_IN;
  const PAD_X = 24;
  const PAD_Y = 22;

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

  function gradient(id, stops) {
    const g = s('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 });
    for (const [offset, color] of stops) g.append(s('stop', { offset, 'stop-color': color }));
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

  /* links */

  function specFor(key) {
    if (key === 'base') return { len: SIZE.L, label: 'ZÁKLAD', base: true };
    if (key.startsWith('bat:')) return { len: SIZE[key.split(':')[1]], label: BATTERY.code };
    const mod = MODULES.find((m) => m.key === key);
    return { len: SIZE[mod.size], label: mod.code };
  }

  // Each link owns the metal plate at its left end (male) and a slot at its right end (female).
  // The next link's plate covers that slot, so the chain reads like the prototype's bridged joints.
  function buildLink(key) {
    const { len: L, label, base } = specFor(key);
    const py = (H - PLATE_H) / 2;
    const g = s('g', { class: base ? 'link is-base' : 'link' });
    const inner = s('g', { class: 'link__in' });

    inner.append(
      s('rect', { class: 'l-body', x: 0, y: 0, width: L, height: H, rx: 7 }),
      s('rect', { class: 'l-sheen', x: 1.5, y: 1.5, width: L - 3, height: H - 3, rx: 5.5 }),
      s('rect', { class: 'l-cap', x: 0.6, y: 7, width: 2.2, height: H - 14, rx: 1 }),
      s('rect', { class: 'l-cap', x: L - 2.8, y: 7, width: 2.2, height: H - 14, rx: 1 }),
      ...[[6, 3.8], [6, H - 3.8], [L - 6, 3.8], [L - 6, H - 3.8]].map(([cx, cy]) => s('circle', { class: 'l-screw', cx, cy, r: 1.3 })),
      s('rect', { class: 'l-slot', x: L - PLATE_IN, y: py, width: PLATE_IN, height: PLATE_H, rx: 1.5 }),
      s('text', { class: 'l-text', x: L / 2, y: H / 2 + 3.8, 'text-anchor': 'middle' }, label),
      s('rect', { class: 'l-plate', x: -TONGUE, y: py, width: TONGUE + PLATE_IN, height: PLATE_H, rx: 2 }),
      s('line', { class: 'l-seam', x1: -G / 2, y1: py + 0.5, x2: -G / 2, y2: py + PLATE_H - 0.5 }),
      s('line', { class: 'l-shine', x1: -TONGUE + 2, y1: py + 2.4, x2: PLATE_IN - 2, y2: py + 2.4 })
    );

    g.append(inner);
    return g;
  }

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

  const defs = s('defs');
  defs.append(
    gradient('g-body', [[0, '#2d3134'], [0.5, '#1e2124'], [1, '#16181a']]),
    gradient('g-plate', [[0, '#e2e6e8'], [0.45, '#b6bdc1'], [0.55, '#a1a9ad'], [1, '#c4cacd']]),
    gradient('g-metal', [[0, '#8f979b'], [0.5, '#d4d9dc'], [1, '#737b7f']])
  );
  svg.append(defs);

  const nodes = new Map();
  const cards = new Map();
  const batRows = new Map();
  const presetButtons = new Map();
  let batCard;
  let batCount;
  let ownBtn;
  let ownCount;

  let view = 'custom';
  const custom = loadCustom();

  function loadCustom() {
    const set = { mods: new Set(), bats: { S: 0, M: 0, L: 0 } };
    const raw = store.get('skaplar-sestava');
    if (!raw) return set;
    try {
      const data = JSON.parse(raw);
      (data.mods || []).forEach((k) => { if (MODULES.some((m) => m.key === k)) set.mods.add(k); });
      if (data.bats) {
        for (const size of SIZES) set.bats[size] = Math.max(0, Math.min(BAT_MAX, Math.floor(Number(data.bats[size]) || 0)));
      } else if (SIZE[data.bat]) {
        set.bats[data.bat] = 1;
      }
    } catch (e) { /* ignore a broken saved set */ }
    return set;
  }

  function saveCustom() {
    store.set('skaplar-sestava', JSON.stringify({ mods: [...custom.mods], bats: custom.bats }));
  }

  const isLocked = () => view !== 'custom';
  const activeSet = () => (view === 'custom' ? custom : PRESETS.find((p) => p.id === view));
  const batTotal = (set) => SIZES.reduce((sum, size) => sum + set.bats[size], 0);
  const countOf = (set) => set.mods.size + batTotal(set);

  function keysOf(set) {
    const keys = ['base', ...MODULES.filter((m) => set.mods.has(m.key)).map((m) => m.key)];
    for (const size of SIZES) {
      for (let i = 0; i < set.bats[size]; i++) keys.push(`bat:${size}:${i}`);
    }
    return keys;
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
      const node = buildLink(key);
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
    const chainW = TONGUE + lens.reduce((sum, len) => sum + len, 0) + (keys.length - 1) * G + PAD_X * 2;
    const style = getComputedStyle(wrap);
    const avail = wrap.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    // Fixed scale: the box keeps its size and links keep theirs; a long chain scrolls instead of shrinking.
    const k = avail < 640 ? 0.95 : 1.3;
    const vw = Math.max(avail / k, chainW);
    const vh = H + PAD_Y * 2;

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    svg.setAttribute('width', vw * k);
    svg.setAttribute('height', vh * k);

    let x = (vw - chainW) / 2 + PAD_X + TONGUE;
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
    for (const size of SIZES) {
      if (set.bats[size]) names.push(`${set.bats[size]}× ${BAT_LABEL[size].toLowerCase()} baterie`);
    }
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

    const total = batTotal(set);
    batCard.classList.toggle('is-on', total > 0);
    batCount.textContent = `${total}×`;
    for (const [size, row] of batRows) {
      const count = set.bats[size];
      row.el.classList.toggle('is-on', count > 0);
      row.out.textContent = String(count);
      row.minus.disabled = locked || count === 0;
      row.plus.disabled = locked || count >= BAT_MAX;
    }
  }

  function sizeBar(scale) {
    const bar = h('span', 'mod__size');
    bar.style.setProperty('--s', scale);
    bar.setAttribute('aria-hidden', 'true');
    return bar;
  }

  function icon(paths) {
    const el = s('svg', { viewBox: '0 0 12 12', 'aria-hidden': 'true' });
    for (const [cls, d] of paths) {
      const p = s('path', { d });
      if (cls) p.setAttribute('class', cls);
      el.append(p);
    }
    return el;
  }

  function stateIcon() {
    const state = h('span', 'mod__state');
    state.setAttribute('aria-hidden', 'true');
    state.append(icon([['i-plus', 'M6 1.5v9M1.5 6h9'], ['i-check', 'M2 6.4l2.6 2.6L10 3.2']]));
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
  const batState = h('span', 'mod__state');
  batState.setAttribute('aria-hidden', 'true');
  batCount = h('span', 'i-count');
  batState.append(icon([['i-plus', 'M6 1.5v9M1.5 6h9']]), batCount);
  const batName = h('span', 'mod__name', BATTERY.name);
  batName.id = 'batName';
  const bats = h('div', 'bats');

  for (const size of SIZES) {
    const el = h('div', 'bat');
    const label = h('span', 'bat__label');
    label.append(sizeBar(SIZE_SCALE[size]), BAT_LABEL[size]);
    const stepper = h('div', 'stepper');
    const minus = h('button', 'step');
    minus.type = 'button';
    minus.setAttribute('aria-label', `Odebrat ${BAT_ACC[size]} baterii`);
    minus.append(icon([['', 'M2 6h8']]));
    const out = h('output', '', '0');
    out.setAttribute('aria-label', `${BAT_LABEL[size]} baterie, počet`);
    const plus = h('button', 'step step--add');
    plus.type = 'button';
    plus.setAttribute('aria-label', `Přidat ${BAT_ACC[size]} baterii`);
    plus.append(icon([['', 'M6 2v8M2 6h8']]));

    minus.addEventListener('click', () => {
      if (isLocked() || custom.bats[size] === 0) return;
      custom.bats[size] -= 1;
      saveCustom();
      sync(true);
    });
    plus.addEventListener('click', () => {
      if (isLocked() || custom.bats[size] >= BAT_MAX) return;
      custom.bats[size] += 1;
      saveCustom();
      sync(true);
    });

    stepper.append(minus, out, plus);
    el.append(label, stepper);
    bats.append(el);
    batRows.set(size, { el, out, minus, plus });
  }

  batCard.append(h('span', 'mod__code', `${BATTERY.code} · 3 velikosti`), batState, batName, h('span', 'mod__desc', BATTERY.desc), bats);
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
    custom.bats = { ...preset.bats };
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
