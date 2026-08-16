/**
 * Meishi Craft Studio - Application Logic
 * Interactive Business Card Generator for Freelancers & Sole Proprietors
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- DOM Elements Reference ---
  const state = {
    template: 'minimal-modern',
    orientation: 'horizontal',
    fontFamily: 'font-sans-modern',
    viewMode: 'both',
    showBackside: true,
    showQr: true,
    logoUrl: null,
    qrInstance: null,
  };

  // Inputs
  const inputCompanyName = document.getElementById('inputCompanyName');
  const inputCatchphrase = document.getElementById('inputCatchphrase');
  const inputNameJa = document.getElementById('inputNameJa');
  const inputNameEn = document.getElementById('inputNameEn');
  const inputTitle = document.getElementById('inputTitle');
  const inputPhone = document.getElementById('inputPhone');
  const inputEmail = document.getElementById('inputEmail');
  const inputWebsite = document.getElementById('inputWebsite');
  const inputAddress = document.getElementById('inputAddress');
  const inputLogoFile = document.getElementById('inputLogoFile');
  const btnRemoveLogo = document.getElementById('btnRemoveLogo');

  // Backside Inputs
  const toggleBackside = document.getElementById('toggleBackside');
  const backsideFormContainer = document.getElementById('backsideFormContainer');
  const inputBackHeader = document.getElementById('inputBackHeader');
  const inputBackServices = document.getElementById('inputBackServices');
  const toggleQr = document.getElementById('toggleQr');
  const qrConfigGroup = document.getElementById('qrConfigGroup');
  const inputQrUrl = document.getElementById('inputQrUrl');

  // Displays
  const dispCompanyName = document.getElementById('dispCompanyName');
  const dispCatchphrase = document.getElementById('dispCatchphrase');
  const dispNameJa = document.getElementById('dispNameJa');
  const dispNameEn = document.getElementById('dispNameEn');
  const dispTitle = document.getElementById('dispTitle');
  const dispPhone = document.getElementById('dispPhone');
  const dispEmail = document.getElementById('dispEmail');
  const dispWebsite = document.getElementById('dispWebsite');
  const dispAddress = document.getElementById('dispAddress');
  const wrapPhone = document.getElementById('wrapPhone');
  const wrapEmail = document.getElementById('wrapEmail');
  const wrapWebsite = document.getElementById('wrapWebsite');
  const wrapAddress = document.getElementById('wrapAddress');

  const frontLogoWrap = document.getElementById('frontLogoWrap');
  const frontLogoImg = document.getElementById('frontLogoImg');

  const dispBackHeader = document.getElementById('dispBackHeader');
  const dispBackServices = document.getElementById('dispBackServices');
  const dispBackBrandSub = document.getElementById('dispBackBrandSub');
  const wrapQrContainer = document.getElementById('wrapQrContainer');
  const qrCodeTarget = document.getElementById('qrCodeTarget');

  // Stage & Card Elements
  const cardStage = document.getElementById('cardStage');
  const cardFront = document.getElementById('cardFront');
  const cardBack = document.getElementById('cardBack');

  // Customization Controls
  const selectFontFamily = document.getElementById('selectFontFamily');
  const colorPrimary = document.getElementById('colorPrimary');
  const colorAccent = document.getElementById('colorAccent');
  const colorBg = document.getElementById('colorBg');
  const colorText = document.getElementById('colorText');
  const colorPrimaryHex = document.getElementById('colorPrimaryHex');
  const colorAccentHex = document.getElementById('colorAccentHex');
  const colorBgHex = document.getElementById('colorBgHex');
  const colorTextHex = document.getElementById('colorTextHex');
  const rangeFontSize = document.getElementById('rangeFontSize');
  const valFontSize = document.getElementById('valFontSize');
  const rangeNameSize = document.getElementById('rangeNameSize');
  const valNameSize = document.getElementById('valNameSize');

  // Header Actions
  const btnSampleData = document.getElementById('btnSampleData');
  const btnReset = document.getElementById('btnReset');
  const btnPrint = document.getElementById('btnPrint');
  const btnDownloadPng = document.getElementById('btnDownloadPng');

  // View Switchers
  const btnViewBoth = document.getElementById('btnViewBoth');
  const btnViewFront = document.getElementById('btnViewFront');
  const btnViewBack = document.getElementById('btnViewBack');

  // LocalStorage Key & Auto-Save Handler
  const STORAGE_KEY = 'meishi_craft_pro_data_v1';
  let saveTimer = null;

  function triggerAutoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveToLocalStorage, 250);
  }

  function saveToLocalStorage() {
    try {
      const saveData = {
        companyName: inputCompanyName.value,
        catchphrase: inputCatchphrase.value,
        nameJa: inputNameJa.value,
        nameEn: inputNameEn.value,
        title: inputTitle.value,
        phone: inputPhone.value,
        email: inputEmail.value,
        website: inputWebsite.value,
        address: inputAddress.value,
        backHeader: inputBackHeader.value,
        backServices: inputBackServices.value,
        qrUrl: inputQrUrl.value,
        showBackside: state.showBackside,
        showQr: state.showQr,
        template: state.template,
        orientation: state.orientation,
        fontFamily: selectFontFamily.value,
        colorPrimary: colorPrimary.value,
        colorAccent: colorAccent.value,
        colorBg: colorBg.value,
        colorText: colorText.value,
        rangeFontSize: rangeFontSize ? rangeFontSize.value : 110,
        rangeNameSize: rangeNameSize ? rangeNameSize.value : 100,
        logoUrl: state.logoUrl
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      
      if (data.companyName !== undefined) inputCompanyName.value = data.companyName;
      if (data.catchphrase !== undefined) inputCatchphrase.value = data.catchphrase;
      if (data.nameJa !== undefined) inputNameJa.value = data.nameJa;
      if (data.nameEn !== undefined) inputNameEn.value = data.nameEn;
      if (data.title !== undefined) inputTitle.value = data.title;
      if (data.phone !== undefined) inputPhone.value = data.phone;
      if (data.email !== undefined) inputEmail.value = data.email;
      if (data.website !== undefined) inputWebsite.value = data.website;
      if (data.address !== undefined) inputAddress.value = data.address;
      if (data.backHeader !== undefined) inputBackHeader.value = data.backHeader;
      if (data.backServices !== undefined) inputBackServices.value = data.backServices;
      if (data.qrUrl !== undefined) inputQrUrl.value = data.qrUrl;

      if (data.showBackside !== undefined) {
        state.showBackside = data.showBackside;
        toggleBackside.checked = state.showBackside;
        backsideFormContainer.style.display = state.showBackside ? 'block' : 'none';
        cardBack.style.display = state.showBackside ? 'block' : 'none';
      }
      if (data.showQr !== undefined) {
        state.showQr = data.showQr;
        toggleQr.checked = state.showQr;
        qrConfigGroup.style.display = state.showQr ? 'block' : 'none';
        wrapQrContainer.style.display = state.showQr ? 'flex' : 'none';
      }

      if (data.fontFamily) {
        selectFontFamily.value = data.fontFamily;
        state.fontFamily = data.fontFamily;
      }
      if (data.colorPrimary) colorPrimary.value = data.colorPrimary;
      if (data.colorAccent) colorAccent.value = data.colorAccent;
      if (data.colorBg) colorBg.value = data.colorBg;
      if (data.colorText) colorText.value = data.colorText;

      if (data.rangeFontSize && rangeFontSize) rangeFontSize.value = data.rangeFontSize;
      if (data.rangeNameSize && rangeNameSize) rangeNameSize.value = data.rangeNameSize;

      if (data.template) {
        state.template = data.template;
        const activeCard = document.querySelector(`.template-card[data-template="${data.template}"]`);
        if (activeCard) {
          document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
          activeCard.classList.add('active');
        }
        cardStage.className = cardStage.className.replace(/template-\S+/g, `template-${data.template}`);
      }

      if (data.orientation) {
        state.orientation = data.orientation;
        const activeSeg = document.querySelector(`.seg-btn[data-orientation="${data.orientation}"]`);
        if (activeSeg) {
          document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
          activeSeg.classList.add('active');
        }
        if (state.orientation === 'horizontal') {
          cardStage.classList.remove('orientation-vertical');
          cardStage.classList.add('orientation-horizontal');
        } else {
          cardStage.classList.remove('orientation-horizontal');
          cardStage.classList.add('orientation-vertical');
        }
      }

      if (data.logoUrl !== undefined) {
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl, false);
        } else {
          removeLogo(false);
        }
      }

      return true;
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
      return false;
    }
  }

  // --- INITIALIZATION ---
  function init() {
    setupTabSwitching();
    setupAccordions();
    setupEventListeners();
    setupTemplateSelector();
    setupOrientationSelector();
    setupColorPickers();
    
    const loaded = loadFromLocalStorage();
    if (!loaded) {
      setLogoUrl('logo1.jpg', false);
    }

    updateQrCode();
    renderAll();
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Inputs Event Binding
    const liveInputs = [
      { input: inputCompanyName, target: dispCompanyName },
      { input: inputCatchphrase, target: dispCatchphrase },
      { input: inputNameJa, target: dispNameJa },
      { input: inputNameEn, target: dispNameEn },
      { input: inputTitle, target: dispTitle },
      { input: inputBackHeader, target: dispBackHeader },
    ];

    liveInputs.forEach(({ input, target }) => {
      if (input && target) {
        input.addEventListener('input', () => {
          target.textContent = input.value || '';
          if (input === inputCompanyName) {
            dispBackBrandSub.textContent = input.value || '';
          }
          triggerAutoSave();
        });
      }
    });

    // Contact items visibility & text update
    [inputPhone, inputEmail, inputWebsite, inputAddress].forEach(input => {
      input.addEventListener('input', () => {
        updateContacts();
        triggerAutoSave();
      });
    });

    // Backside Services List Rendering
    inputBackServices.addEventListener('input', () => {
      renderBackServices();
      triggerAutoSave();
    });

    // Checkboxes
    toggleBackside.addEventListener('change', (e) => {
      state.showBackside = e.target.checked;
      backsideFormContainer.style.display = state.showBackside ? 'block' : 'none';
      cardBack.style.display = state.showBackside ? 'block' : 'none';
      triggerAutoSave();
    });

    toggleQr.addEventListener('change', (e) => {
      state.showQr = e.target.checked;
      qrConfigGroup.style.display = state.showQr ? 'block' : 'none';
      wrapQrContainer.style.display = state.showQr ? 'flex' : 'none';
      triggerAutoSave();
    });

    inputQrUrl.addEventListener('input', () => {
      updateQrCode();
      triggerAutoSave();
    });

    // Font Family Switch
    selectFontFamily.addEventListener('change', (e) => {
      state.fontFamily = e.target.value;
      cardStage.className = cardStage.className.replace(/font-\S+/g, state.fontFamily);
      triggerAutoSave();
    });

    // Font Size Range & Name Scale Range
    function applyFontSizes() {
      const globalVal = rangeFontSize ? rangeFontSize.value : 110;
      if (valFontSize) valFontSize.textContent = `${globalVal}%`;
      const globalScale = globalVal / 100;
      cardFront.style.fontSize = `${globalScale}rem`;
      cardBack.style.fontSize = `${globalScale}rem`;

      const nameVal = rangeNameSize ? rangeNameSize.value : 100;
      if (valNameSize) valNameSize.textContent = `${nameVal}%`;
      const nameScale = (nameVal / 100) * 2.1;
      if (dispNameJa) dispNameJa.style.fontSize = `${nameScale}em`;
    }

    if (rangeFontSize) {
      rangeFontSize.addEventListener('input', applyFontSizes);
    }
    if (rangeNameSize) {
      rangeNameSize.addEventListener('input', applyFontSizes);
    }

    // Apply font sizes on startup
    applyFontSizes();

  // Logo Upload & Presets
  const btnPresetLogo1 = document.getElementById('btnPresetLogo1');
  const btnPresetLogo2 = document.getElementById('btnPresetLogo2');

  btnPresetLogo1.addEventListener('click', () => setLogoUrl('logo1.jpg'));
  btnPresetLogo2.addEventListener('click', () => setLogoUrl('logo2.jpg'));

  function setLogoUrl(url) {
    state.logoUrl = url;
    frontLogoImg.src = url;
    frontLogoWrap.classList.remove('style-hidden');
    btnRemoveLogo.classList.remove('style-hidden');
  }

  inputLogoFile.addEventListener('change', handleLogoUpload);
  btnRemoveLogo.addEventListener('click', removeLogo);

    // View Switchers
    btnViewBoth.addEventListener('click', () => setViewMode('both'));
    btnViewFront.addEventListener('click', () => setViewMode('front'));
    btnViewBack.addEventListener('click', () => setViewMode('back'));

    // Top Header Buttons
    btnSampleData.addEventListener('click', loadSampleData);
    btnReset.addEventListener('click', resetAll);
    btnPrint.addEventListener('click', triggerPrint);
    btnDownloadPng.addEventListener('click', downloadAsPng);
  }

  // --- TAB & ACCORDION SYSTEM ---
  function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPaneId = tab.dataset.tab;
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        document.getElementById(targetPaneId).classList.add('active');
      });
    });
  }

  function setupAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
      });
    });
  }

  // --- TEMPLATE & LAYOUT SELECTORS ---
  function setupTemplateSelector() {
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        state.template = card.dataset.template;
        applyTemplate(state.template);
        triggerAutoSave();
      });
    });
  }

  function applyTemplate(tplName) {
    // Update Stage class
    cardStage.className = cardStage.className.replace(/template-\S+/g, `template-${tplName}`);
    
    // Apply template default colors
    const defaults = {
      'minimal-modern': { primary: '#1e293b', accent: '#3b82f6', bg: '#ffffff', text: '#0f172a' },
      'executive-gold': { primary: '#0f172a', accent: '#d97706', bg: '#ffffff', text: '#1e293b' },
      'creative-studio': { primary: '#0f172a', accent: '#6366f1', bg: '#ffffff', text: '#0f172a' },
      'warm-organic': { primary: '#44403c', accent: '#0f766e', bg: '#fafaf9', text: '#292524' },
      'mono-clean': { primary: '#18181b', accent: '#52525b', bg: '#ffffff', text: '#09090b' },
    };

    if (defaults[tplName]) {
      const d = defaults[tplName];
      colorPrimary.value = d.primary;
      colorAccent.value = d.accent;
      colorBg.value = d.bg;
      colorText.value = d.text;
      updateColors();
    }
  }

  function setupOrientationSelector() {
    const buttons = document.querySelectorAll('.seg-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.orientation = btn.dataset.orientation;
        if (state.orientation === 'horizontal') {
          cardStage.classList.remove('orientation-vertical');
          cardStage.classList.add('orientation-horizontal');
        } else {
          cardStage.classList.remove('orientation-horizontal');
          cardStage.classList.add('orientation-vertical');
        }
        triggerAutoSave();
      });
    });
  }

  // --- COLOR CUSTOMIZATION ---
  function setupColorPickers() {
    [colorPrimary, colorAccent, colorBg, colorText].forEach(picker => {
      picker.addEventListener('input', () => {
        updateColors();
        triggerAutoSave();
      });
    });

    // Preset dots
    const dots = document.querySelectorAll('.color-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorPrimary.value = dot.dataset.primary;
        colorAccent.value = dot.dataset.accent;
        colorBg.value = dot.dataset.bg;
        colorText.value = dot.dataset.text;
        updateColors();
        triggerAutoSave();
      });
    });
  }

  function updateColors() {
    colorPrimaryHex.textContent = colorPrimary.value.toUpperCase();
    colorAccentHex.textContent = colorAccent.value.toUpperCase();
    colorBgHex.textContent = colorBg.value.toUpperCase();
    colorTextHex.textContent = colorText.value.toUpperCase();

    // Set CSS custom properties on card elements
    document.documentElement.style.setProperty('--card-primary-color', colorPrimary.value);
    document.documentElement.style.setProperty('--card-accent-color', colorAccent.value);
    document.documentElement.style.setProperty('--card-bg-color', colorBg.value);
    document.documentElement.style.setProperty('--card-text-color', colorText.value);
  }

  // --- CONTACTS UPDATE ---
  function updateContacts() {
    dispPhone.textContent = inputPhone.value;
    wrapPhone.style.display = inputPhone.value.trim() ? 'flex' : 'none';

    dispEmail.textContent = inputEmail.value;
    wrapEmail.style.display = inputEmail.value.trim() ? 'flex' : 'none';

    dispWebsite.textContent = inputWebsite.value;
    wrapWebsite.style.display = inputWebsite.value.trim() ? 'flex' : 'none';

    dispAddress.textContent = inputAddress.value;
    wrapAddress.style.display = inputAddress.value.trim() ? 'flex' : 'none';
  }

  // --- BACKSIDE SERVICES RENDERING ---
  function renderBackServices() {
    const text = inputBackServices.value.trim();
    if (!text) {
      dispBackServices.innerHTML = '';
      return;
    }

    const lines = text.split('\n');
    const html = lines.map(line => {
      const clean = line.replace(/^[・\-\*]\s*/, '');
      return `<div class="service-bullet"><span class="bullet-dot">•</span> ${escapeHtml(clean)}</div>`;
    }).join('');

    dispBackServices.innerHTML = html;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setLogoUrl(url, autoSave = true) {
    state.logoUrl = url;
    frontLogoImg.src = url;
    frontLogoWrap.classList.remove('style-hidden');
    btnRemoveLogo.classList.remove('style-hidden');
    if (autoSave) triggerAutoSave();
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result, true);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeLogo(autoSave = true) {
    state.logoUrl = null;
    frontLogoImg.src = '';
    inputLogoFile.value = '';
    frontLogoWrap.classList.add('style-hidden');
    btnRemoveLogo.classList.add('style-hidden');
    if (autoSave) triggerAutoSave();
  }

  // --- QR CODE GENERATION ---
  function updateQrCode() {
    const url = inputQrUrl.value.trim() || 'https://example.com';
    qrCodeTarget.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      state.qrInstance = new QRCode(qrCodeTarget, {
        text: url,
        width: 76,
        height: 76,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }

  // --- VIEW MODE SWITCHER ---
  function setViewMode(mode) {
    state.viewMode = mode;
    btnViewBoth.classList.toggle('active', mode === 'both');
    btnViewFront.classList.toggle('active', mode === 'front');
    btnViewBack.classList.toggle('active', mode === 'back');

    cardStage.classList.remove('view-front-only', 'view-back-only');
    if (mode === 'front') {
      cardStage.classList.add('view-front-only');
    } else if (mode === 'back') {
      cardStage.classList.add('view-back-only');
    }
  }

  // --- SAMPLE DATA LOAD ---
  function loadSampleData() {
    inputCompanyName.value = "Care DX Studio";
    inputCatchphrase.value = "ケアマネ業務をDXで加速。アプリ開発からシステム管理まで";
    inputNameJa.value = "山田 太郎";
    inputNameEn.value = "TARO YAMADA";
    inputTitle.value = "代表 / ケアマネDXアプリ開発・システム管理者";
    inputPhone.value = "090-1234-5678";
    inputEmail.value = "info@caredx-lab.com";
    inputWebsite.value = "https://caredx-lab.com";
    inputAddress.value = "〒150-0001 東京都渋谷区神宮前 1-2-3";

    inputBackHeader.value = "SERVICES & SOLUTIONS";
    inputBackServices.value = "【ケアマネDX アプリ開発 & システム管理】\n・LuminaCare（介護記録・利用者管理DXアプリ）\n・CarePlan Checker（AI書類監査・不整合検知99.8%）\n・利用者ファイルの自動仕分けアプリ開発\n・売上・請求管理 ＆ ケアマネDX導入コンサルティング";
    inputQrUrl.value = "https://caredx-lab.com";

    renderAll();
    triggerAutoSave();
    
    // Quick notification toast or visual pulse
    cardFront.style.transform = 'scale(1.03)';
    setTimeout(() => { cardFront.style.transform = ''; }, 300);
  }

  function resetAll() {
    if (confirm('名刺の入力内容を初期化しますか？')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch(e) {}
      inputCompanyName.value = "Lumina Works";
      inputCatchphrase.value = "UI/UX Design & Web Strategy";
      inputNameJa.value = "佐藤 翔太";
      inputNameEn.value = "SHOTA SATO";
      inputTitle.value = "代表 / UI/UXデザイナー";
      inputPhone.value = "090-1234-5678";
      inputEmail.value = "sato@luminaworks.jp";
      inputWebsite.value = "https://luminaworks.jp";
      inputAddress.value = "〒150-0001 東京都渋谷区神宮前 1-2-3";
      removeLogo(false);
      renderAll();
      triggerAutoSave();
    }
  }

  function renderAll() {
    dispCompanyName.textContent = inputCompanyName.value;
    dispCatchphrase.textContent = inputCatchphrase.value;
    dispNameJa.textContent = inputNameJa.value;
    dispNameEn.textContent = inputNameEn.value;
    dispTitle.textContent = inputTitle.value;
    dispBackHeader.textContent = inputBackHeader.value;
    dispBackBrandSub.textContent = inputCompanyName.value;
    updateContacts();
    renderBackServices();
    updateQrCode();
    updateColors();
    if (typeof applyFontSizes === 'function') applyFontSizes();
  }

  // --- PNG DOWNLOAD & PRINT ---
  function downloadAsPng() {
    if (typeof html2canvas === 'undefined') {
      alert('画像生成ライブラリの読み込み中です。少々お待ちください。');
      return;
    }

    const targetCards = [];
    if (state.viewMode === 'both' || state.viewMode === 'front') {
      targetCards.push({ elem: cardFront, filename: `meishi_front_${inputNameJa.value}.png` });
    }
    if (state.showBackside && (state.viewMode === 'both' || state.viewMode === 'back')) {
      targetCards.push({ elem: cardBack, filename: `meishi_back_${inputNameJa.value}.png` });
    }

    targetCards.forEach(({ elem, filename }) => {
      html2canvas(elem, {
        scale: 4, // 350+ DPI high resolution
        useCORS: true,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          // Ensure cloned elements retain precise font styles
          const clonedCard = clonedDoc.getElementById(elem.id);
          if (clonedCard && elem) {
            clonedCard.style.fontSize = elem.style.fontSize;
            syncElementStyles(elem, clonedCard);
          }
        }
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  }

  function triggerPrint() {
    const printFront = document.getElementById('printTargetFront');
    const printBack = document.getElementById('printTargetBack');

    if (printFront && cardFront) {
      printFront.innerHTML = cardFront.innerHTML;
      printFront.className = cardFront.className;
      printFront.style.cssText = cardFront.style.cssText;
      syncElementStyles(cardFront, printFront);
    }

    if (printBack && cardBack) {
      printBack.innerHTML = cardBack.innerHTML;
      printBack.className = cardBack.className;
      printBack.style.cssText = cardBack.style.cssText;
      syncElementStyles(cardBack, printBack);
    }

    window.print();
  }

  function syncElementStyles(src, dest) {
    const srcNodes = src.querySelectorAll('*');
    const destNodes = dest.querySelectorAll('*');
    srcNodes.forEach((node, i) => {
      if (destNodes[i] && node.style.cssText) {
        destNodes[i].style.cssText = node.style.cssText;
      }
    });
  }

  // Run Startup
  init();
});
