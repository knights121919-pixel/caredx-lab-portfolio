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

  // Header Actions
  const btnSampleData = document.getElementById('btnSampleData');
  const btnReset = document.getElementById('btnReset');
  const btnPrint = document.getElementById('btnPrint');
  const btnDownloadPng = document.getElementById('btnDownloadPng');

  // View Switchers
  const btnViewBoth = document.getElementById('btnViewBoth');
  const btnViewFront = document.getElementById('btnViewFront');
  const btnViewBack = document.getElementById('btnViewBack');

  // --- INITIALIZATION ---
  function init() {
    setupTabSwitching();
    setupAccordions();
    setupEventListeners();
    setupTemplateSelector();
    setupOrientationSelector();
    setupColorPickers();
    updateQrCode();
    setLogoUrl('logo1.jpg');
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
        });
      }
    });

    // Contact items visibility & text update
    [inputPhone, inputEmail, inputWebsite, inputAddress].forEach(input => {
      input.addEventListener('input', updateContacts);
    });

    // Backside Services List Rendering
    inputBackServices.addEventListener('input', renderBackServices);

    // Checkboxes
    toggleBackside.addEventListener('change', (e) => {
      state.showBackside = e.target.checked;
      backsideFormContainer.style.display = state.showBackside ? 'block' : 'none';
      cardBack.style.display = state.showBackside ? 'block' : 'none';
    });

    toggleQr.addEventListener('change', (e) => {
      state.showQr = e.target.checked;
      qrConfigGroup.style.display = state.showQr ? 'block' : 'none';
      wrapQrContainer.style.display = state.showQr ? 'flex' : 'none';
    });

    inputQrUrl.addEventListener('input', () => {
      updateQrCode();
    });

    // Font Family Switch
    selectFontFamily.addEventListener('change', (e) => {
      state.fontFamily = e.target.value;
      cardStage.className = cardStage.className.replace(/font-\S+/g, state.fontFamily);
    });

    // Font Size Range
    rangeFontSize.addEventListener('input', (e) => {
      const val = e.target.value;
      valFontSize.textContent = `${val}%`;
      const scale = val / 100;
      cardFront.style.fontSize = `${scale}em`;
      cardBack.style.fontSize = `${scale}em`;
    });

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
      });
    });
  }

  // --- COLOR CUSTOMIZATION ---
  function setupColorPickers() {
    [colorPrimary, colorAccent, colorBg, colorText].forEach(picker => {
      picker.addEventListener('input', updateColors);
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

  // --- LOGO MANAGEMENT ---
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.logoUrl = event.target.result;
        frontLogoImg.src = state.logoUrl;
        frontLogoWrap.classList.remove('style-hidden');
        btnRemoveLogo.classList.remove('style-hidden');
      };
      reader.readAsDataURL(file);
    }
  }

  function removeLogo() {
    state.logoUrl = null;
    frontLogoImg.src = '';
    inputLogoFile.value = '';
    frontLogoWrap.classList.add('style-hidden');
    btnRemoveLogo.classList.add('style-hidden');
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
    inputTitle.value = "代表 / 介護DXアプリ開発・システム管理者";
    inputPhone.value = "090-1234-5678";
    inputEmail.value = "info@caredx-lab.com";
    inputWebsite.value = "https://caredx-lab.com";
    inputAddress.value = "〒150-0001 東京都渋谷区神宮前 1-2-3";

    inputBackHeader.value = "SERVICES & SOLUTIONS";
    inputBackServices.value = "【ケアマネDX アプリ開発 & システム管理】\n・LuminaCare（介護記録・利用者管理DXアプリ）\n・CarePlan Checker（AI書類監査・不整合検知99.8%）\n・利用者ファイルの自動仕分けアプリ開発\n・売上・請求管理 ＆ 介護DX導入コンサルティング";
    inputQrUrl.value = "https://caredx-lab.com";

    renderAll();
    
    // Quick notification toast or visual pulse
    cardFront.style.transform = 'scale(1.03)';
    setTimeout(() => { cardFront.style.transform = ''; }, 300);
  }

  function resetAll() {
    if (confirm('名刺の入力内容を初期化しますか？')) {
      inputCompanyName.value = "Lumina Works";
      inputCatchphrase.value = "UI/UX Design & Web Strategy";
      inputNameJa.value = "佐藤 翔太";
      inputNameEn.value = "SHOTA SATO";
      inputTitle.value = "代表 / UI/UXデザイナー";
      inputPhone.value = "090-1234-5678";
      inputEmail.value = "sato@luminaworks.jp";
      inputWebsite.value = "https://luminaworks.jp";
      inputAddress.value = "〒150-0001 東京都渋谷区神宮前 1-2-3";
      removeLogo();
      renderAll();
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
        backgroundColor: null
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

    printFront.innerHTML = cardFront.innerHTML;
    printBack.innerHTML = cardBack.innerHTML;

    printFront.className = cardFront.className;
    printBack.className = cardBack.className;

    window.print();
  }

  // Run Startup
  init();
});
