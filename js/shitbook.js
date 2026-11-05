/**
 * SHITBOOK — HYPERGAMIE MACBOOKŮ (SKAPLAR.COM)
 * Interactive Engine: Configurator, E-Shop Cart, Hypergamy SMV Calculator, Web Audio FX,
 * Hypergamy Diagram SVG Renderer, FYP 2026 Soundboard & Aura Tracker
 */

(() => {
  'use strict';

  /* ==========================================================================
     AUDIO FX (Web Audio API Synthesizer)
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.enabled = localStorage.getItem('shitbook_sound') !== 'false';
      this.ctx = null;
    }

    initCtx() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    playClick() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.09, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.25);
        });
      } catch (e) {}
    }

    playAuraLoss() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
      } catch (e) {}
    }

    playPhonkBass() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      } catch (e) {}
    }

    playJetEngine() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.7);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
      } catch (e) {}
    }

    playFlatline() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.9);
      } catch (e) {}
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('shitbook_sound', this.enabled ? 'true' : 'false');
      return this.enabled;
    }
  }

  const sfx = new SoundFX();

  /* ==========================================================================
     CATALOG DATA (WITH PHOTOGRAPHIC RENDERS)
     ========================================================================== */
  const PRODUCTS = [
    {
      id: 'sb-pro-16-max',
      name: 'ShitBook Pro 16″ Hypergamy Max',
      badge: 'GIGACHAD STATUS',
      badgeClass: 'badge-gold',
      category: 'pro',
      basePrice: 189990,
      baseSmv: 9.9,
      subtitle: 'Čip M4 Max · 128 GB Unified Memory · 8 TB SSD · Space Black',
      desc: 'Pohlcovač pohledů v kavárně. Space Black lak pohlcuje 99.8% světla a 100% pochybností o tvém bankovním kontu. V EMA Espresso Baru získáš stůl s předstihem.',
      specs: [
        'M4 Max 16-core CPU',
        'Zero Swap Memory',
        '120Hz ProMotion flex',
        'Aura v Karlíně: +1 000 000'
      ],
      image: 'img/shitbook_pro_spaceblack.jpg',
      svgType: 'pro16',
      color: 'spaceblack'
    },
    {
      id: 'sb-pro-14-redpill',
      name: 'ShitBook Pro 14″ Redpill Special',
      badge: 'OPTIMÁLNÍ KOMPROMIS',
      badgeClass: 'badge-blue',
      category: 'pro',
      basePrice: 64990,
      baseSmv: 7.8,
      subtitle: 'Čip M3 Pro · 18 GB RAM · 1 TB SSD · Space Black',
      desc: '18 GB RAM je mistrovské dílo Tim Cooka — ani málo, ani dost, přesně tolik, aby ses necítil jako incel, ale v noci přemýšlel, proč jsi nevzal Maxe.',
      specs: [
        'M3 Pro 11-core CPU',
        '18 GB RAM (psychologická hranice)',
        'HDMI port (žádný trapný dongle)',
        'Barista tě aspoň pozdraví'
      ],
      image: 'img/shitbook_pro_spaceblack.jpg',
      svgType: 'pro14',
      color: 'spaceblack'
    },
    {
      id: 'sb-air-13-incel',
      name: 'ShitBook Air 13″ Incel Copium',
      badge: 'SUB-5 ENTRY LEVEL',
      badgeClass: 'badge-hot',
      category: 'air',
      basePrice: 24990,
      baseSmv: 2.1,
      subtitle: 'Čip M1 · 8 GB RAM · 256 GB Throttled SSD · Rose Gold',
      desc: 'Legendární konfigurace, na které otevřeš tři taby v Safari a systém nahlásí "Nedostatek aplikační paměti". Perfektní, pokud chceš v kavárně sedět zcela sám.',
      specs: [
        'Pasivní chlazení (smaží se na 104°C)',
        '8GB = 16GB certifikovaný copium',
        'Baterka na 74% kapacity',
        'Aura v Karlíně: -500 000'
      ],
      svgType: 'air13',
      color: 'rosegold'
    },
    {
      id: 'sb-air-15-normie',
      name: 'ShitBook Air 15″ Coffee Normie',
      badge: 'MID-TIER SLEEK',
      badgeClass: 'badge-blue',
      category: 'air',
      basePrice: 42990,
      baseSmv: 6.2,
      subtitle: 'Čip M3 · 16 GB RAM · 512 GB SSD · Midnight Blue',
      desc: 'Vypadá jako Pro, stojí méně než Pro, ale chybí mu větrák a porty. V kavárně udělá dojem na studenty gymnázia, markeťačky však prohlédnou tvůj bluf.',
      specs: [
        '15.3″ Liquid Retina',
        '16 GB RAM (Normie standard)',
        'Otisky prstů na laku do 3 sekund',
        'Aura ve Starbucks: Neutrální'
      ],
      image: 'img/karlin_cafe_lifestyle.jpg',
      svgType: 'air15',
      color: 'starlight'
    },
    {
      id: 'sb-touchbar-chernobyl',
      name: 'ShitBook Chernobyl Vintage 15″',
      badge: 'THERMAL DISASTER',
      badgeClass: 'badge-warn',
      category: 'vintage',
      basePrice: 14990,
      baseSmv: 0.9,
      subtitle: 'Intel Core i9 · Touch Bar · Butterfly Klávesnice · Silver',
      desc: 'Zahřeje celou kancelář. Dva větráky řvou na 7 200 RPM už při otevření kalkulačky. Jedno zrnko prachu pod mezerníkem znamená generální opravu za 14 000 Kč.',
      specs: [
        'Intel Core i9 (přímotop 98°C)',
        'Hluk: 84 dB (Boeing 747)',
        'Touch Bar svítí a zamrzá',
        'Výdrž baterie: 22 minut'
      ],
      image: 'img/shitbook_chernobyl.jpg',
      svgType: 'chernobyl',
      color: 'silver'
    },
    {
      id: 'acc-shitcloth-ultra',
      name: 'ShitCloth™ iHadřík Ultra Max',
      badge: '99% MARŽE',
      badgeClass: 'badge-gold',
      category: 'acc',
      basePrice: 890,
      baseSmv: 8.5,
      subtitle: 'Neabrazivní mikrovlákno · Vyražené logo Skaplar · Bílá',
      desc: 'Statusový hadřík pro leštění loga. Umožňuje sedět v kavárně tři hodiny, nepustit notebook a pouze metodicky leštit povrch s pohledem génia.',
      specs: [
        'Kompatibilní se všemi displeji',
        'Zvýší cenu notebooku o 15%',
        'Praní zakázáno (ztráta záruky)',
        'Pocit nadřazenosti: 100%'
      ],
      image: 'img/shitcloth_luxury.jpg',
      svgType: 'cloth',
      color: 'silver'
    },
    {
      id: 'acc-dongle-octopus',
      name: 'Dongle Octopus™ 18v1 Chobotnice',
      badge: 'KYBER-BYPASS',
      badgeClass: 'badge-warn',
      category: 'acc',
      basePrice: 2490,
      baseSmv: 3.0,
      subtitle: 'USB-C na VGA, SCART, RS-232, disketovou mechaniku a jack',
      desc: 'Visí z boku ShitBooku jako umělá plíce. Nezbytný doplněk pro každého, kdo si koupil minimalistický notebook a teď k němu nosí brašnu plnou kabelů.',
      specs: [
        '18 konektorů v řadě',
        'Hmotnost: 420 g kabeláže',
        'Hřeje více než ShitBook Air',
        'Spolehlivost: Náhodná'
      ],
      svgType: 'dongle',
      color: 'spaceblack'
    },
    {
      id: 'acc-sticker-copium',
      name: 'Nálepka "8GB IS ENOUGH" Copium',
      badge: 'PSYCHOLOGICKÝ ŠTÍT',
      badgeClass: 'badge-hot',
      category: 'acc',
      basePrice: 290,
      baseSmv: 1.5,
      subtitle: 'Matná vinylová samolepka · Odolná vůči slzám z Activity Monitoru',
      desc: 'Nalep na víko svého M1 Air a ukaž celému světu, že se odmítáš smířit s realitou swapování.',
      specs: [
        '100% vodotěsná',
        'Zakryje škrábanec z batohu',
        'Uklidňuje majitele před spaním',
        'Doporučeno Timem Cookem'
      ],
      svgType: 'sticker',
      color: 'rosegold'
    }
  ];

  /* ==========================================================================
     SHOPPING CART STATE
     ========================================================================== */
  class CartManager {
    constructor() {
      this.items = this.load();
      this.promoDiscount = 0;
      this.promoSurcharge = 0;
      this.promoPenalty = 0;
      this.appliedCode = null;
    }

    load() {
      try {
        const stored = localStorage.getItem('shitbook_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    save() {
      try {
        localStorage.setItem('shitbook_cart', JSON.stringify(this.items));
      } catch (e) {}
    }

    addItem(product, config = {}) {
      const configKey = `${product.id}_${config.ram || 'def'}_${config.ssd || 'def'}_${config.color || 'def'}_${config.cloth ? 'cloth' : 'nocli'}_${config.barista ? 'bar' : 'nobar'}`;
      const existing = this.items.find(i => i.key === configKey);

      let price = product.basePrice;
      let smv = product.baseSmv;

      if (config.ramPrice) price += config.ramPrice;
      if (config.ssdPrice) price += config.ssdPrice;
      if (config.cloth) price += 890;
      if (config.barista) price += 499;

      if (config.ramSmv) smv += config.ramSmv;

      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({
          key: configKey,
          id: product.id,
          name: product.name,
          baseName: product.name,
          price: price,
          smv: Math.min(10, Math.max(0.5, smv)),
          qty: 1,
          config: config,
          svgType: product.svgType,
          image: product.image
        });
      }

      this.save();
      this.render();
      sfx.playSuccess();
      showToast(`🛒 Přidáno do košíku: ${product.name}`);
    }

    removeItem(key) {
      this.items = this.items.filter(i => i.key !== key);
      this.save();
      this.render();
      sfx.playClick();
    }

    clear() {
      this.items = [];
      this.promoDiscount = 0;
      this.promoSurcharge = 0;
      this.promoPenalty = 0;
      this.appliedCode = null;
      this.save();
      this.render();
    }

    applyPromo(code) {
      const clean = (code || '').trim().toUpperCase();
      this.promoDiscount = 0;
      this.promoSurcharge = 0;
      this.promoPenalty = 0;
      this.appliedCode = null;

      if (clean === 'COPIUM') {
        this.promoDiscount = 0.15;
        this.appliedCode = 'COPIUM (-15% kompenzace za psychickou újmu)';
        showToast('✅ Promo kód COPIUM uplatněn: 15% sleva na odškodnění!');
      } else if (clean === 'KARLIN') {
        this.promoSurcharge = 0.20;
        this.appliedCode = 'KARLIN (+20% Karlínská hipster přirážka)';
        showToast('☕ Kód KARLIN: Připočteno 20% za výběrovou kávu a flex!');
      } else if (clean === '8GB') {
        this.promoPenalty = 5000;
        this.appliedCode = '8GB (+5 000 Kč pokuta za šíření dezinformací)';
        showToast('⚠️ Pokuta 5 000 Kč za obhajobu 8GB RAM na Macu v roce 2026!');
      } else if (clean === 'TIMCOOK') {
        this.promoDiscount = 0.01;
        this.appliedCode = 'TIMCOOK (-1% sleva z milosti Tim Cooka)';
        showToast('🍏 Tim Cook ti osobně poděkoval za nákup s 1% slevou.');
      } else {
        showToast('❌ Neznámý kód. Zkus COPIUM, KARLIN nebo 8GB.');
      }

      this.render();
    }

    calculateTotal() {
      let subtotal = this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      let discountAmount = subtotal * this.promoDiscount;
      let surchargeAmount = subtotal * this.promoSurcharge;
      let total = subtotal - discountAmount + surchargeAmount + this.promoPenalty;
      return {
        subtotal,
        discountAmount,
        surchargeAmount,
        penalty: this.promoPenalty,
        total: Math.max(0, Math.round(total))
      };
    }

    render() {
      const badge = document.getElementById('cartBadge');
      const count = this.items.reduce((sum, i) => sum + i.qty, 0);
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }

      const list = document.getElementById('cartItemsList');
      const emptyState = document.getElementById('cartEmptyState');
      const footer = document.getElementById('cartDrawerFooter');

      if (!list) return;

      if (this.items.length === 0) {
        list.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (footer) footer.style.display = 'none';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      if (footer) footer.style.display = 'block';

      list.innerHTML = this.items.map(item => {
        const configDesc = [];
        if (item.config.ramLabel) configDesc.push(item.config.ramLabel);
        if (item.config.ssdLabel) configDesc.push(item.config.ssdLabel);
        if (item.config.colorLabel) configDesc.push(item.config.colorLabel);
        if (item.config.cloth) configDesc.push('+ iHadřík');
        if (item.config.barista) configDesc.push('+ Barista VIP');

        return `
          <div class="cart-item-row" data-key="${item.key}">
            <div class="cart-item-thumb">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">` : renderMiniSvg(item.svgType)}
            </div>
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name} (${item.qty}×)</div>
              <div class="cart-item-desc">${configDesc.join(' · ') || 'Základní konfigurace'}</div>
              <div class="cart-item-price">${(item.price * item.qty).toLocaleString('cs-CZ')} Kč <span style="font-size:0.75rem;color:#9ca3af;">(SMV ${item.smv.toFixed(1)})</span></div>
            </div>
            <button class="cart-item-remove" data-remove-key="${item.key}" aria-label="Odstranit položku">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        `;
      }).join('');

      // Totals
      const totals = this.calculateTotal();
      const subtotalEl = document.getElementById('cartSubtotal');
      const discountEl = document.getElementById('cartDiscountRow');
      const grandTotalEl = document.getElementById('cartGrandTotal');

      if (subtotalEl) subtotalEl.textContent = `${totals.subtotal.toLocaleString('cs-CZ')} Kč`;
      if (grandTotalEl) grandTotalEl.textContent = `${totals.total.toLocaleString('cs-CZ')} Kč`;

      if (discountEl) {
        if (this.appliedCode) {
          discountEl.style.display = 'flex';
          discountEl.innerHTML = `<span>Úprava kódem (${this.appliedCode}):</span> <strong>${(totals.surchargeAmount - totals.discountAmount + totals.penalty).toLocaleString('cs-CZ')} Kč</strong>`;
        } else {
          discountEl.style.display = 'none';
        }
      }
    }
  }

  const cart = new CartManager();

  /* ==========================================================================
     SVG RENDER HELPERS
     ========================================================================== */
  function renderProductSvg(type, color = 'spaceblack') {
    if (type === 'dongle') {
      return `
        <svg viewBox="0 0 200 160" class="product-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="75" y="30" width="50" height="90" rx="8" fill="#1f2937" stroke="#4b5563" stroke-width="2"/>
          <rect x="85" y="10" width="30" height="20" rx="2" fill="#374151" stroke="#6b7280"/>
          <path d="M80 120 C60 140 30 135 25 150" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
          <path d="M90 120 C85 145 70 150 70 160" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
          <path d="M110 120 C115 145 130 150 130 160" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 120 C140 140 170 135 175 150" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
          <rect x="82" y="45" width="36" height="8" rx="2" fill="#090a0f"/>
          <rect x="82" y="60" width="36" height="8" rx="2" fill="#090a0f"/>
          <rect x="82" y="75" width="36" height="8" rx="2" fill="#090a0f"/>
          <circle cx="100" cy="100" r="5" fill="#38bdf8"/>
        </svg>
      `;
    }

    if (type === 'sticker') {
      return `
        <svg viewBox="0 0 200 160" class="product-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="35" width="140" height="90" rx="14" fill="#f43f5e" stroke="#fda4af" stroke-width="2"/>
          <rect x="35" y="40" width="130" height="80" rx="10" fill="#e11d48"/>
          <text x="100" y="72" font-size="16" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="900">8GB IS ENOUGH</text>
          <text x="100" y="92" font-size="10" fill="#fecdd3" text-anchor="middle" font-family="monospace">COPIUM CERTIFIED</text>
          <circle cx="148" cy="98" r="8" fill="#fbbf24"/>
          <text x="148" y="101" font-size="8" fill="#000" text-anchor="middle" font-weight="bold">OK</text>
        </svg>
      `;
    }

    // Default Laptop SVGs
    let lidColor = '#181920';
    let borderColor = '#2d303e';
    let baseColor = '#1e2029';
    let glowColor = '#38bdf8';

    if (type === 'air13') {
      lidColor = '#241a20';
      borderColor = '#b87c88';
      baseColor = '#3a242c';
      glowColor = '#f43f5e';
    } else if (type === 'chernobyl') {
      lidColor = '#1e222a';
      borderColor = '#475569';
      baseColor = '#334155';
      glowColor = '#f59e0b';
    } else if (type === 'pro16') {
      lidColor = '#090a0d';
      borderColor = '#1e212b';
      baseColor = '#13141a';
      glowColor = '#38bdf8';
    }

    return `
      <svg viewBox="0 0 240 180" class="product-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-${type}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${glowColor}" flood-opacity="0.25"/>
          </filter>
        </defs>
        <rect x="36" y="24" width="168" height="106" rx="10" fill="${lidColor}" stroke="${borderColor}" stroke-width="2.5" filter="url(#glow-${type})"/>
        <path d="M102 24 L138 24 L135 32 L105 32 Z" fill="#000"/>
        <circle cx="120" cy="28" r="1.5" fill="#38bdf8"/>
        <rect x="42" y="34" width="156" height="90" rx="4" fill="#030712"/>
        ${type === 'air13' ? `
          <rect x="58" y="55" width="124" height="48" rx="6" fill="#1f1215" stroke="#f43f5e"/>
          <text x="120" y="73" font-size="8" fill="#f43f5e" font-family="monospace" text-anchor="middle" font-weight="bold">SWAP: 18.4 GB / 8 GB</text>
          <text x="120" y="87" font-size="7" fill="#fda4af" font-family="monospace" text-anchor="middle">Safari: Not Responding</text>
        ` : `
          <text x="50" y="55" font-size="7" fill="#10b981" font-family="monospace">SMV: GIGACHAD 10/10</text>
          <text x="50" y="68" font-size="7" fill="#38bdf8" font-family="monospace">RAM_SWAP: 0.0 KB (ZERO)</text>
          <text x="50" y="81" font-size="7" fill="#94a3b8" font-family="monospace">CHAD_RADIUS: 45 METERS</text>
          <rect x="50" y="88" width="140" height="6" rx="3" fill="#1e293b"/>
          <rect x="50" y="88" width="135" height="6" rx="3" fill="#38bdf8"/>
        `}
        <path d="M20 134 C20 132 24 130 30 130 L210 130 C216 130 220 132 220 134 L224 145 C224 148 220 150 214 150 L26 150 C20 150 16 148 16 145 Z" fill="${baseColor}" stroke="${borderColor}" stroke-width="1.5"/>
        <rect x="100" y="131" width="40" height="3" rx="1.5" fill="#475569"/>
      </svg>
    `;
  }

  function renderMiniSvg(type) {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 18h20M9 8h6"/></svg>`;
  }

  /* ==========================================================================
     RENDER PRODUCT CATALOG (WITH PHOTOGRAPHIC RENDERS)
     ========================================================================== */
  function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = filter === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(prod => `
      <article class="product-card" data-category="${prod.category}">
        <div class="product-badge-wrap">
          <span class="product-badge ${prod.badgeClass}">${prod.badge}</span>
          <span class="smv-indicator">SMV: <span>${prod.baseSmv.toFixed(1)}/10</span></span>
        </div>

        <div class="product-visual-wrap">
          ${prod.image ? `<img src="${prod.image}" alt="${prod.name}" class="product-img-render" loading="lazy">` : renderProductSvg(prod.svgType, prod.color)}
        </div>

        <div class="product-info">
          <h3 class="product-title">${prod.name}</h3>
          <p class="product-subtitle">${prod.subtitle}</p>
          <p class="product-desc">${prod.desc}</p>

          <ul class="product-specs-list">
            ${prod.specs.map(s => `<li><span class="spec-icon">✓</span> ${s}</li>`).join('')}
          </ul>

          <div class="product-footer">
            <div class="product-price-box">
              <span class="price-label">Základní cena flexu</span>
              <span class="price-amount">${prod.basePrice.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div class="product-btns">
              <button class="btn-config" data-open-config="${prod.id}">
                ${prod.category === 'acc' ? 'Koupit' : 'Konfigurovat & SMV'}
              </button>
              <button class="btn-quick-add" data-quick-add="${prod.id}" title="Rychle do košíku">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  /* ==========================================================================
     HYPERGAMY DIAGRAM ENGINE (RECREATION OF THE MEME GRAPHIC)
     ========================================================================== */
  function initHypergamyDiagram() {
    const leftCanvas = document.getElementById('diagramCanvasLeft');
    const rightCanvas = document.getElementById('diagramCanvasRight');
    if (!leftCanvas || !rightCanvas) return;

    // Generate Left SVG (Rational Needs: evenly distributed cross-matching)
    // 10 personas (left) to 10 laptops (right)
    const N = 10;
    const stageHeight = 520;
    const step = stageHeight / N;
    const padding = step / 2;

    let leftLinesSvg = `
      <defs>
        <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#e11d48" stop-opacity="0.5"/>
        </linearGradient>
      </defs>
    `;

    // Cross-connecting lines
    for (let i = 0; i < N; i++) {
      const y1 = i * step + padding;
      // Connect to i, i-1, i+1, i+2
      const targets = [i, (i + 1) % N, (i + 2) % N];
      targets.forEach(t => {
        const y2 = t * step + padding;
        leftLinesSvg += `<line x1="38%" y1="${y1}" x2="62%" y2="${y2}" stroke="url(#redGrad)" stroke-width="1.2" stroke-opacity="0.45"/>`;
        // Arrow head
        leftLinesSvg += `<circle cx="62%" cy="${y2}" r="2" fill="#f43f5e"/>`;
      });
    }
    leftCanvas.innerHTML = leftLinesSvg;

    // Generate Right SVG (Hypergamy: ALL 10 personas point ONLY to top 2-3 laptops!)
    let rightLinesSvg = `
      <defs>
        <linearGradient id="blueLaser" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
    `;

    const topTargetsY = [
      0 * step + padding,      // M4 Max 128GB
      1 * step + padding,      // M4 Pro 24GB
      2 * step + padding * 0.9 // M3 Max
    ];

    for (let i = 0; i < N; i++) {
      const yFemale = i * step + padding;
      // EVERY single female persona shoots arrows to topTargetsY[0], [1], [2]
      topTargetsY.forEach(tY => {
        rightLinesSvg += `<line x1="62%" y1="${yFemale}" x2="38%" y2="${tY}" stroke="url(#blueLaser)" stroke-width="1.5" stroke-opacity="0.75"/>`;
        rightLinesSvg += `<circle cx="38%" cy="${tY}" r="2.5" fill="#38bdf8"/>`;
      });
    }
    rightCanvas.innerHTML = rightLinesSvg;

    // Hover interactions on right side nodes
    const rightLaptops = document.querySelectorAll('#rightLaptopsList .diagram-node');
    rightLaptops.forEach((node, idx) => {
      node.addEventListener('mouseenter', () => {
        sfx.playClick();
        if (idx === 0) {
          showToast('👑 M4 Max 128GB: 100% poptávky na trhu! Baristka nosí flat white automaticky zdarma.');
        } else if (idx === 1) {
          showToast('💼 M4 Pro 24GB: Minimální hranice pro zamezení trapného ticha.');
        } else if (idx === 2) {
          showToast('🤔 M3 Max: Poptávka existuje, ale už se ptají, proč nemáš M4.');
        } else {
          showToast(`❌ ${node.textContent.trim()}: 0 zájemkyň! Režim: Sub-5 Incel karanténa.`);
        }
      });
    });
  }

  /* ==========================================================================
     TIKTOK FYP 2026 SOUNDBOARD
     ========================================================================== */
  function initSoundboard() {
    const soundBtns = document.querySelectorAll('[data-sound-type]');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.soundType;
        if (type === 'aura-loss') {
          sfx.playAuraLoss();
          showToast('📉 -500 000 AURA BODŮ: Vytáhl jsi 8GB Air v Karlíně a disk swapuje!');
        } else if (type === 'phonk-bass') {
          sfx.playPhonkBass();
          showToast('🗿 GIGACHAD MOGGING: Space Black víko otevřeno na 105 stupňů!');
        } else if (type === 'jet-engine') {
          sfx.playJetEngine();
          showToast('✈️ INTEL CORE i9 BOEING 747: Dva fukary řvou na 7 200 RPM v tiché kavárně!');
        } else if (type === 'flatline') {
          sfx.playFlatline();
          showToast('💀 IT\'S SO OVER: Systém zamrzl při otevření čtvrtého tabu ve Figmě!');
        } else if (type === 'success') {
          sfx.playSuccess();
          showToast('✨ +1 000 000 AURA: Otřel jsi displej originálním iHadříkem za 890 Kč.');
        }
      });
    });
  }

  /* ==========================================================================
     PRODUCT CONFIGURATOR MODAL
     ========================================================================== */
  class Configurator {
    constructor() {
      this.currentProduct = null;
      this.state = {
        ram: '8gb',
        ramPrice: 0,
        ramSmv: 0,
        ramLabel: '8 GB Copium',
        ssd: '256gb',
        ssdPrice: 0,
        ssdLabel: '256 GB Throttled',
        color: 'spaceblack',
        colorLabel: 'Space Black Chad',
        cloth: false,
        barista: false
      };

      this.overlay = document.getElementById('configModalOverlay');
      this.bindEvents();
    }

    bindEvents() {
      if (!this.overlay) return;

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      const closeBtn = document.getElementById('configCloseBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      const addBtn = document.getElementById('configAddToCartBtn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          if (!this.currentProduct) return;
          cart.addItem(this.currentProduct, { ...this.state });
          this.close();
        });
      }
    }

    open(productId) {
      const prod = PRODUCTS.find(p => p.id === productId);
      if (!prod) return;

      this.currentProduct = prod;

      if (prod.category === 'pro') {
        this.state = {
          ram: '36gb',
          ramPrice: 0,
          ramSmv: 0.8,
          ramLabel: '36 GB Pro Memory',
          ssd: '1tb',
          ssdPrice: 0,
          ssdLabel: '1 TB High-Speed SSD',
          color: 'spaceblack',
          colorLabel: 'Space Black',
          cloth: true,
          barista: false
        };
      } else {
        this.state = {
          ram: '8gb',
          ramPrice: 0,
          ramSmv: -2.0,
          ramLabel: '8 GB Copium',
          ssd: '256gb',
          ssdPrice: 0,
          ssdLabel: '256 GB Single NAND',
          color: 'rosegold',
          colorLabel: 'Rose Gold',
          cloth: false,
          barista: false
        };
      }

      this.render();
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      sfx.playClick();
    }

    close() {
      if (!this.overlay) return;
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      sfx.playClick();
    }

    render() {
      const prod = this.currentProduct;
      if (!prod) return;

      const titleEl = document.getElementById('configTitle');
      const subEl = document.getElementById('configSub');
      const bodyEl = document.getElementById('configBody');

      if (titleEl) titleEl.textContent = `Konfigurace: ${prod.name}`;
      if (subEl) subEl.textContent = `Vylaď parametry pro maximální dominanci a nulový swap`;

      if (!bodyEl) return;

      const ramOptions = [
        { id: '8gb', name: '8 GB Unified Memory', extra: 'Copium mode · swapuje i kalkulačka', price: 0, smv: -2.5 },
        { id: '16gb', name: '16 GB Unified Memory', extra: 'Normie standard (+6 000 Kč)', price: 6000, smv: 0 },
        { id: '36gb', name: '36 GB Unified Memory', extra: 'Redpill flex (+18 000 Kč)', price: 18000, smv: 1.2 },
        { id: '128gb', name: '128 GB Gigachad Memory', extra: 'Zero swap navždy (+48 000 Kč)', price: 48000, smv: 2.8 }
      ];

      const ssdOptions = [
        { id: '256gb', name: '256 GB SSD (1 čip)', extra: 'Čtení throttlováno na polovinu', price: 0 },
        { id: '512gb', name: '512 GB SSD (2 čipy)', extra: 'Normální rychlost (+6 000 Kč)', price: 6000 },
        { id: '2tb', name: '2 TB SSD Flex', extra: 'Vejde se i 4K video (+24 000 Kč)', price: 24000 },
        { id: '8tb', name: '8 TB Infinite Wealth', extra: 'Prodat auto (+68 000 Kč)', price: 68000 }
      ];

      const colors = [
        { id: 'spaceblack', name: 'Space Black', extra: 'Aura +1 000 000 v Karlíně' },
        { id: 'silver', name: 'Silver Vintage', extra: 'Pro účetní a rodiče' },
        { id: 'rosegold', name: 'Rose Gold Incel', extra: 'Zaručeně si k tobě nikdo nesedne' },
        { id: 'starlight', name: 'Starlight Champagne', extra: 'Střední třída s iluzemi' }
      ];

      bodyEl.innerHTML = `
        <div class="config-group">
          <div class="config-group-title">
            <span>1. Velikost Unified Memory (RAM)</span>
            <span style="font-size:0.8rem;color:var(--accent-cyan);">Vliv na SMV: klíčový</span>
          </div>
          <div class="config-pills">
            ${ramOptions.map(opt => `
              <div class="config-pill ${this.state.ram === opt.id ? 'active' : ''}" data-config-type="ram" data-val="${opt.id}" data-price="${opt.price}" data-smv="${opt.smv}" data-label="${opt.name}">
                <div class="pill-name">${opt.name}</div>
                <div class="pill-extra">${opt.extra}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="config-group">
          <div class="config-group-title">
            <span>2. Úložiště (SSD)</span>
          </div>
          <div class="config-pills">
            ${ssdOptions.map(opt => `
              <div class="config-pill ${this.state.ssd === opt.id ? 'active' : ''}" data-config-type="ssd" data-val="${opt.id}" data-price="${opt.price}" data-label="${opt.name}">
                <div class="pill-name">${opt.name}</div>
                <div class="pill-extra">${opt.extra}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="config-group">
          <div class="config-group-title">
            <span>3. Barva šasi (Chromatický status)</span>
          </div>
          <div class="config-pills">
            ${colors.map(c => `
              <div class="config-pill ${this.state.color === c.id ? 'active' : ''}" data-config-type="color" data-val="${c.id}" data-label="${c.name}">
                <div class="pill-name">${c.name}</div>
                <div class="pill-extra">${c.extra}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="config-group">
          <div class="config-group-title">
            <span>4. Nezbytné příplatkové absurdity</span>
          </div>
          <div class="config-pills">
            <div class="config-pill ${this.state.cloth ? 'active' : ''}" data-config-toggle="cloth">
              <div class="pill-name">ShitCloth™ iHadřík (+890 Kč)</div>
              <div class="pill-extra">Originální hadřík na leštění loga</div>
            </div>
            <div class="config-pill ${this.state.barista ? 'active' : ''}" data-config-toggle="barista">
              <div class="pill-name">VIP Barista Aura (+499 Kč)</div>
              <div class="pill-extra">Barista napíše tvé jméno na kelímek bez překlepu</div>
            </div>
          </div>
        </div>
      `;

      bodyEl.querySelectorAll('.config-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          sfx.playClick();
          const type = pill.dataset.configType;
          const toggle = pill.dataset.configToggle;

          if (type === 'ram') {
            this.state.ram = pill.dataset.val;
            this.state.ramPrice = parseInt(pill.dataset.price, 10);
            this.state.ramSmv = parseFloat(pill.dataset.smv);
            this.state.ramLabel = pill.dataset.label;
          } else if (type === 'ssd') {
            this.state.ssd = pill.dataset.val;
            this.state.ssdPrice = parseInt(pill.dataset.price, 10);
            this.state.ssdLabel = pill.dataset.label;
          } else if (type === 'color') {
            this.state.color = pill.dataset.val;
            this.state.colorLabel = pill.dataset.label;
          } else if (toggle === 'cloth') {
            this.state.cloth = !this.state.cloth;
          } else if (toggle === 'barista') {
            this.state.barista = !this.state.barista;
          }

          this.render();
        });
      });

      let totalPrice = prod.basePrice + this.state.ramPrice + this.state.ssdPrice;
      if (this.state.cloth) totalPrice += 890;
      if (this.state.barista) totalPrice += 499;

      let calcSmv = Math.min(10, Math.max(0.5, prod.baseSmv + this.state.ramSmv));

      const priceEl = document.getElementById('configTotalPrice');
      const smvEl = document.getElementById('configSmvScore');
      if (priceEl) priceEl.textContent = `${totalPrice.toLocaleString('cs-CZ')} Kč`;
      if (smvEl) smvEl.textContent = `Odhadovaný SMV: ${calcSmv.toFixed(1)} / 10`;
    }
  }

  const configurator = new Configurator();

  /* ==========================================================================
     SMV CALCULATOR
     ========================================================================== */
  class SmvCalculator {
    constructor() {
      this.currentStep = 0;
      this.answers = {};
      this.questions = [
        {
          id: 'model',
          title: 'Krok 1: Jaký hardware v současnosti otevíráš na veřejnosti?',
          options: [
            { id: 'm4max', title: 'ShitBook Pro 16″ M4 Max (Space Black)', desc: '128GB RAM, žádný kompromis, kupoval jsi za hotové.', pts: 35 },
            { id: 'm3pro', title: 'ShitBook Pro 14″ M3 Pro (18GB)', desc: 'Snažíš se vypadat úspěšně, ale máš leasing na 3 roky.', pts: 22 },
            { id: 'm2air', title: 'ShitBook Air 15″ M2/M3 (16GB)', desc: 'Slušný normie laptop, ale bez MagSafe flexu to bolí.', pts: 14 },
            { id: 'm1air8', title: 'ShitBook Air 13″ M1 (8GB RAM)', desc: 'Student humanitních studií, swap paměti 18GB, Rose Gold.', pts: -15 },
            { id: 'intel', title: 'Intel MacBook Pro 2017–2019 (Touch Bar)', desc: 'Zvuk startujícího letadla, topí na 100°C, lepí se mezerník.', pts: -30 },
            { id: 'pc', title: 'Černý plastový notebook s Windows', desc: 'RGB světýlka, váha 3.8 kg, naprostý celibát.', pts: -50 }
          ]
        },
        {
          id: 'venue',
          title: 'Krok 2: Kde nejčastěji rozkládáš své digitální ležení?',
          options: [
            { id: 'karlin', title: 'EMA Espresso Bar / Karlín hipster kavárna', desc: 'Ovesné mléko za 120 Kč, stůl obsazený 4 hodiny na jedné kávě.', pts: 25 },
            { id: 'starbucks', title: 'Starbucks Václavák / Palladium', desc: 'Klasický mainstreamový flex pro lidi z Instagramu.', pts: 15 },
            { id: 'library', title: 'Národní technická knihovna (NTK)', desc: 'Akademický pot a tiché porovnávání úhlopříček.', pts: 5 },
            { id: 'bed', title: 'Doma v posteli se zataženými závěsy', desc: 'Nikdo tě nevidí, nikdo tě nesoudí, Activity Monitor pláče.', pts: -15 }
          ]
        },
        {
          id: 'dongles',
          title: 'Krok 3: Kolik adaptérů a redukcí nosíš v batohu?',
          options: [
            { id: 'zero', title: 'Žádný (Čistý MagSafe & Cloud purista)', desc: 'Všechno řešíš přes AirDrop a iCloud, dominance.', pts: 20 },
            { id: 'one', title: 'Jeden malý bílý USB-C adaptér', desc: 'Když je potřeba strčit do toho cizí flashku.', pts: 8 },
            { id: 'octopus', title: 'Chobotnice 14v1 s kabelem jako had', desc: 'Přívěsek hanby visící z boku tvého luxusního hliníku.', pts: -15 },
            { id: 'bag', title: 'Celá igelitka redukcí na VGA a ethernet', desc: 'Pracuješ ve státní správě nebo na fakultě.', pts: -30 }
          ]
        },
        {
          id: 'cloth',
          title: 'Krok 4: Čím otíráš displej od otisků prstů?',
          options: [
            { id: 'ihadrik', title: 'Originální Apple Polishing Cloth za 590 Kč', desc: 'Leštíš logo s náboženskou úctou před celou kavárnou.', pts: 20 },
            { id: 'micro', title: 'Obyčejné mikrovlákno z DM drogerie', desc: 'Praktický člověk, ale kavárenský flex klesá.', pts: 5 },
            { id: 'sleeve', title: 'Rukáv mikiny nebo tričko', desc: 'Šmouhy zůstávají, ale tobě je to fuk.', pts: -10 },
            { id: 'never', title: 'Neotírám. Klávesnice je obtisknutá ve skle.', desc: 'Trvalá mapa mastnoty z chipsů a slz.', pts: -25 }
          ]
        },
        {
          id: 'copium',
          title: 'Krok 5: Kterou větu jsi v životě vyslovil nejčastěji?',
          options: [
            { id: 'quote1', title: '„M4 Max nepotřebuju kvůli výkonu, ale pro auru.“', desc: 'Přijal jsi blackpill a žiješ pravdu.', pts: 20 },
            { id: 'quote2', title: '„Mně těch 8 GB na Macu na všechno bohatě stačí.“', desc: 'Extrémní stadium kognitivní disonance a copiu.', pts: -25 },
            { id: 'quote3', title: '„Touch Bar byl ve skutečnosti nepochopený génius.“', desc: 'Lidé se ti vyhýbají na ulici.', pts: -20 },
            { id: 'quote4', title: '„Dělám ve Figmě a mám otevřených 60 tabů.“', desc: 'Racionální omluva pro nákup za 100 tisíc.', pts: 10 }
          ]
        }
      ];

      this.init();
    }

    init() {
      const nextBtn = document.getElementById('calcNextBtn');
      const prevBtn = document.getElementById('calcPrevBtn');
      const restartBtn = document.getElementById('calcRestartBtn');
      const shareBtn = document.getElementById('calcShareBtn');

      if (nextBtn) nextBtn.addEventListener('click', () => this.next());
      if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
      if (restartBtn) restartBtn.addEventListener('click', () => this.restart());
      if (shareBtn) shareBtn.addEventListener('click', () => this.share());

      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.questions[this.currentStep];
      const titleEl = document.getElementById('calcQuestionTitle');
      const optionsEl = document.getElementById('calcOptionsGrid');
      const stepCounter = document.getElementById('calcStepCounter');
      const fillBar = document.getElementById('calcProgressFill');
      const nextBtn = document.getElementById('calcNextBtn');
      const prevBtn = document.getElementById('calcPrevBtn');

      if (!q || !optionsEl) return;

      if (titleEl) titleEl.textContent = q.title;
      if (stepCounter) stepCounter.textContent = `Otázka ${this.currentStep + 1} z ${this.questions.length}`;
      if (fillBar) fillBar.style.width = `${((this.currentStep + 1) / this.questions.length) * 100}%`;

      if (prevBtn) prevBtn.disabled = this.currentStep === 0;

      const selectedId = this.answers[q.id];
      if (nextBtn) nextBtn.disabled = !selectedId;

      optionsEl.innerHTML = q.options.map(opt => `
        <div class="calc-option-btn ${selectedId === opt.id ? 'selected' : ''}" data-opt-id="${opt.id}" data-pts="${opt.pts}">
          <span class="calc-opt-badge" style="background:${opt.pts >= 20 ? 'rgba(56,189,248,0.2)' : opt.pts < 0 ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.1)'}; color:${opt.pts >= 20 ? '#38bdf8' : opt.pts < 0 ? '#f43f5e' : '#cbd5e1'};">
            ${opt.pts >= 20 ? 'CHAD' : opt.pts < 0 ? 'COPIUM' : 'NORMIE'}
          </span>
          <div class="calc-opt-title">${opt.title}</div>
          <div class="calc-opt-desc">${opt.desc}</div>
        </div>
      `).join('');

      optionsEl.querySelectorAll('.calc-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sfx.playClick();
          optionsEl.querySelectorAll('.calc-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.answers[q.id] = btn.dataset.optId;
          if (nextBtn) nextBtn.disabled = false;
        });
      });
    }

    next() {
      sfx.playClick();
      if (this.currentStep < this.questions.length - 1) {
        this.currentStep++;
        this.renderQuestion();
      } else {
        this.showResult();
      }
    }

    prev() {
      sfx.playClick();
      if (this.currentStep > 0) {
        this.currentStep--;
        this.renderQuestion();
      }
    }

    restart() {
      sfx.playClick();
      this.currentStep = 0;
      this.answers = {};
      const quizPanel = document.getElementById('calcQuizPanel');
      const resultPanel = document.getElementById('calcResultPanel');
      if (quizPanel) quizPanel.style.display = 'block';
      if (resultPanel) resultPanel.classList.remove('active');
      this.renderQuestion();
    }

    showResult() {
      sfx.playSuccess();
      const quizPanel = document.getElementById('calcQuizPanel');
      const resultPanel = document.getElementById('calcResultPanel');
      if (quizPanel) quizPanel.style.display = 'none';
      if (resultPanel) resultPanel.classList.add('active');

      let totalPts = 20;
      this.questions.forEach(q => {
        const picked = this.answers[q.id];
        const opt = q.options.find(o => o.id === picked);
        if (opt) totalPts += opt.pts;
      });

      let smvScore = Math.min(100, Math.max(1, Math.round((totalPts / 120) * 100)));

      let tierTitle = '';
      let tierClass = '';
      let diagnosis = '';
      let cafeAttraction = '';
      let swapLevel = '';
      let baristaContact = '';

      if (smvScore >= 80) {
        tierTitle = '👑 Karlínský Space Black Gigachad';
        tierClass = 'tier-chad';
        diagnosis = 'Tvá aura v kavárně je tak silná, že barista ti automaticky nosí flat white zdarma. Nikdo se neodváží zeptat na tvoji RAM, protože Space Black finiš mluví za vše. Žádný swap memory v historii vesmíru.';
        cafeAttraction = '45 metrů (celý blok)';
        swapLevel = '0.0 kB (Zero Swap God)';
        baristaContact = '99.8% (automatické přátelství)';
      } else if (smvScore >= 55) {
        tierTitle = '💼 Mid-Tier Redpill Brad';
        tierClass = 'tier-normie';
        diagnosis = 'Jsi na dobré cestě. Chápeš podstatu ekosystému a vyhnul ses největším pastem, ale tvůj hardware stále vykazuje známky kompromisu. Kup si iHadřík na leštění, ať zamaskuješ nejistotu.';
        cafeAttraction = '12 metrů (tvůj stůl a okolí)';
        swapLevel = '2.4 GB (střední riziko)';
        baristaContact = '42.0% (pouze formální úsměv)';
      } else {
        tierTitle = '⚠️ Sub-Five Incel Swap Coper';
        tierClass = 'tier-incel';
        diagnosis = 'Tvůj notebook právě swapuje i otevřený textový soubor v Poznámkách. Lidé v kavárně od tebe odsedávají, protože slyší neexistující větrák tvého copiu o tom, že „8GB je jako 16GB“. Okamžitě upgraduj na ShitBook Pro!';
        cafeAttraction = '0 metrů (sociální karanténa)';
        swapLevel = '19.8 GB (paměť v kómatu)';
        baristaContact = '0.001% (vyhýbá se očnímu kontaktu)';
      }

      const scoreEl = document.getElementById('calcFinalScore');
      const tierEl = document.getElementById('calcFinalTier');
      const diagEl = document.getElementById('calcFinalDiagnosis');
      const radEl = document.getElementById('calcResAttraction');
      const swapEl = document.getElementById('calcResSwap');
      const barEl = document.getElementById('calcResBarista');

      if (scoreEl) scoreEl.textContent = smvScore;
      if (tierEl) {
        tierEl.textContent = tierTitle;
        tierEl.className = `result-tier-pill ${tierClass}`;
      }
      if (diagEl) diagEl.textContent = diagnosis;
      if (radEl) radEl.textContent = cafeAttraction;
      if (swapEl) swapEl.textContent = swapLevel;
      if (barEl) barEl.textContent = baristaContact;
    }

    share() {
      sfx.playClick();
      const score = document.getElementById('calcFinalScore')?.textContent || '50';
      const tier = document.getElementById('calcFinalTier')?.textContent || 'SMV';
      const text = `Můj MacBook SMV je ${score}/100 (${tier}) podle Skaplar ShitBook! Otestuj se na https://skaplar.com`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('📋 Výsledek zkopírován do schránky! Můžeš flexit na TikToku nebo X.');
        });
      } else {
        showToast('📋 ' + text);
      }
    }
  }

  /* ==========================================================================
     SOCIAL PROOF TICKER TOAST
     ========================================================================== */
  const SOCIAL_NOTIFICATIONS = [
    { text: 'Vojta z Karlína právě koupil ShitBook Pro 16″ M4 Max za 189 990 Kč (+1 000 000 Aura).', icon: '💎' },
    { text: 'TikToker v EMA Espresso Baru právě desk-mognul borce s M1 Air. Poražený sbalil batoh a odešel.', icon: '🗿' },
    { text: 'Petr z Brna právě objednal ShitCloth™ iHadřík za 890 Kč, aby mohl v kavárně 2 hodiny leštit logo.', icon: '✨' },
    { text: 'Slečna v EMA Espresso Baru se podívala na stříbrný M1 Air a raději si objednala ovesné latté s sebou.', icon: '☕' },
    { text: 'Honza z Letné úspěšně připojil 14 donglů naráz. Ztráta 2 000 000 aura bodů.', icon: '🐙' },
    { text: 'Někdo z ČVUT FIT právě tvrdil na TikToku, že 8GB RAM stačí v roce 2026 na střih 8K videa.', icon: '🤡' }
  ];

  let toastTimeout = null;

  function showToast(message, icon = '🍏') {
    const toast = document.getElementById('liveToast');
    if (!toast) return;

    const iconEl = toast.querySelector('.toast-icon');
    const msgEl = toast.querySelector('.toast-message');

    if (iconEl) iconEl.textContent = icon;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  function startSocialTicker() {
    let index = 0;
    setInterval(() => {
      const item = SOCIAL_NOTIFICATIONS[index];
      showToast(item.text, item.icon);
      index = (index + 1) % SOCIAL_NOTIFICATIONS.length;
    }, 18000);
  }

  /* ==========================================================================
     CHECKOUT CONFETTI & FLOW
     ========================================================================== */
  function initCheckout() {
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    const modal = document.getElementById('checkoutSuccessModal');
    const closeBtn = document.getElementById('checkoutCloseBtn');

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
          showToast('Košík je prázdný! Nejdřív si vyber nějaký flex.');
          return;
        }

        sfx.playSuccess();
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartDrawerOverlay');
        if (drawer) drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        if (modal) modal.classList.add('active');
        cart.clear();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        sfx.playClick();
      });
    }
  }

  /* ==========================================================================
     THEME & NAVIGATION & HERO COLOR TOGGLES
     ========================================================================== */
  function initUI() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('shitbook_theme', next);
        sfx.playClick();
        showToast(next === 'dark' ? '🌌 Režim Space Black aktivován' : '☀️ Režim Silver Normie aktivován');
      });
    }

    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = sfx.toggle();
        soundBtn.style.opacity = enabled ? '1' : '0.5';
        sfx.playClick();
        showToast(enabled ? '🔊 Zvukové efekty zapnuty' : '🔇 Zvukové efekty vypnuty');
      });
    }

    const cartToggle = document.getElementById('cartToggleBtn');
    const cartClose = document.getElementById('cartDrawerClose');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartDrawerOverlay');

    if (cartToggle && cartDrawer && cartOverlay) {
      cartToggle.addEventListener('click', () => {
        sfx.playClick();
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      const closeDrawer = () => {
        sfx.playClick();
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (cartClose) cartClose.addEventListener('click', closeDrawer);
      cartOverlay.addEventListener('click', closeDrawer);
    }

    const promoBtn = document.getElementById('promoApplyBtn');
    const promoInput = document.getElementById('promoInput');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        sfx.playClick();
        cart.applyPromo(promoInput.value);
        promoInput.value = '';
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sfx.playClick();
          cart.applyPromo(promoInput.value);
          promoInput.value = '';
        }
      });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
      });
    });

    document.addEventListener('click', (e) => {
      const configBtn = e.target.closest('[data-open-config]');
      if (configBtn) {
        configurator.open(configBtn.dataset.openConfig);
        return;
      }

      const quickAddBtn = e.target.closest('[data-quick-add]');
      if (quickAddBtn) {
        const prod = PRODUCTS.find(p => p.id === quickAddBtn.dataset.quickAdd);
        if (prod) cart.addItem(prod, {});
        return;
      }

      const removeBtn = e.target.closest('[data-remove-key]');
      if (removeBtn) {
        cart.removeItem(removeBtn.dataset.removeKey);
        return;
      }
    });

    const mobBtn = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobBtn && navLinks) {
      mobBtn.addEventListener('click', () => {
        const visible = navLinks.style.display === 'flex';
        navLinks.style.display = visible ? 'none' : 'flex';
        if (!visible) {
          navLinks.style.position = 'absolute';
          navLinks.style.top = '52px';
          navLinks.style.left = '0';
          navLinks.style.width = '100%';
          navLinks.style.background = 'var(--bg-secondary)';
          navLinks.style.flexDirection = 'column';
          navLinks.style.padding = '1.5rem';
          navLinks.style.borderBottom = '1px solid var(--border-subtle)';
        }
      });
    }
  }

  /* ==========================================================================
     INIT ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('shitbook_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    renderProducts('all');
    cart.render();
    initUI();
    initHypergamyDiagram();
    initSoundboard();
    new SmvCalculator();
    initCheckout();

    setTimeout(startSocialTicker, 3000);
  });

})();
