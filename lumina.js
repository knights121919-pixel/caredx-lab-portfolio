/**
 * LuminaCare - Interactive System Simulator Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Tab Navigation & Card Trigger Routing
  // ==========================================
  const tabBtns = document.querySelectorAll('.lumina-tab-btn');
  const panels = document.querySelectorAll('.lumina-panel');
  const demoTriggers = document.querySelectorAll('.lumina-btn-demo-trigger');

  function switchTab(targetTabId) {
    tabBtns.forEach(btn => {
      if (btn.dataset.tab === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    panels.forEach(panel => {
      if (panel.id === `panel-${targetTabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  demoTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.dataset.targetTab;
      if (tabTarget) {
        switchTab(tabTarget);
        const simContainer = document.getElementById('lumina-app-simulator');
        if (simContainer) {
          simContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ==========================================
  // 2. Tab 1: AI OCR Document Reader Logic
  // ==========================================
  const sampleBtns = document.querySelectorAll('.btn-sample');
  const scanBeam = document.getElementById('scanBeam');
  const ocrPreviewContent = document.getElementById('ocrPreviewContent');
  const btnRunOCR = document.getElementById('btnRunOCR');
  const ocrConfidenceBadge = document.getElementById('ocrConfidenceBadge');

  const inputName = document.getElementById('ocrName');
  const inputKana = document.getElementById('ocrKana');
  const inputNum = document.getElementById('ocrNum');
  const inputLevel = document.getElementById('ocrLevel');
  const inputStart = document.getElementById('ocrStart');
  const inputEnd = document.getElementById('ocrEnd');

  const sampleData = {
    sampleA: {
      title: '介護保険証（様式第1号）',
      sub: '被保険者: 山田 和子 様',
      name: '山田 和子',
      kana: 'ヤマダ カズコ',
      num: 'H123456789',
      level: '要介護 2',
      start: '2025-09-01',
      end: '2027-08-31'
    },
    sampleB: {
      title: '介護保険要介護認定決定通知書',
      sub: '被保険者: 佐藤 翔太 様',
      name: '佐藤 翔太',
      kana: 'サトウ ショウタ',
      num: 'H987654321',
      level: '要介護 3',
      start: '2024-04-01',
      end: '2026-09-30'
    }
  };

  let currentSampleKey = 'sampleA';

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sampleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSampleKey = btn.dataset.sample;
      const data = sampleData[currentSampleKey];

      ocrPreviewContent.innerHTML = `
        <i class="fa-solid fa-file-invoice text-primary" style="font-size: 3rem; margin-bottom: 0.5rem;"></i>
        <h5 style="color: #f8fafc; margin-bottom: 0.2rem;">${data.title}</h5>
        <span style="color: #94a3b8; font-size: 0.8rem;">${data.sub} (PDF/Image)</span>
      `;
    });
  });

  if (btnRunOCR) {
    btnRunOCR.addEventListener('click', () => {
      btnRunOCR.disabled = true;
      btnRunOCR.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AIスキャン・文字抽出中...`;
      scanBeam.classList.add('scanning');

      setTimeout(() => {
        scanBeam.classList.remove('scanning');
        btnRunOCR.disabled = false;
        btnRunOCR.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> AI OCRで書類を解析・自動入力`;
        ocrConfidenceBadge.style.display = 'inline-flex';

        const data = sampleData[currentSampleKey];
        fillOCRForm(data);
      }, 1800);
    });
  }

  function fillOCRForm(data) {
    const fields = [
      { el: inputName, val: data.name },
      { el: inputKana, val: data.kana },
      { el: inputNum, val: data.num },
      { el: inputLevel, val: data.level },
      { el: inputStart, val: data.start },
      { el: inputEnd, val: data.end }
    ];

    fields.forEach((item, index) => {
      setTimeout(() => {
        if (item.el) {
          item.el.value = item.val;
          item.el.classList.add('highlighted');
          setTimeout(() => item.el.classList.remove('highlighted'), 1500);
        }
      }, index * 120);
    });
  }

  // ==========================================
  // 3. Tab 2: Certificate & Contract Alert Filter Logic
  // ==========================================
  const alertFilterBtns = document.querySelectorAll('.btn-filter-alert');
  const alertRows = document.querySelectorAll('.alert-table-row');
  const btnSendAlertBatch = document.getElementById('btnSendAlertBatch');
  const alertToast = document.getElementById('alertToast');

  alertFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alertFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      alertRows.forEach(row => {
        if (filterVal === 'all') {
          row.style.display = '';
        } else if (row.dataset.status === filterVal) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  if (btnSendAlertBatch) {
    btnSendAlertBatch.addEventListener('click', () => {
      btnSendAlertBatch.disabled = true;
      btnSendAlertBatch.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 通知送信中...`;

      setTimeout(() => {
        btnSendAlertBatch.disabled = false;
        btnSendAlertBatch.innerHTML = `<i class="fa-solid fa-paper-plane"></i> 要更新・期限切れ利用者に一括更新案内を送信`;
        if (alertToast) {
          alertToast.style.display = 'block';
          setTimeout(() => { alertToast.style.display = 'none'; }, 4000);
        }
      }, 1000);
    });
  }

  // ==========================================
  // 4. Tab 3: Monthly Additions & Delay Management Logic
  // ==========================================
  const kasanCheckboxes = document.querySelectorAll('.kasan-calc-cb');
  const totalUnitsVal = document.getElementById('totalUnitsVal');
  const totalYenVal = document.getElementById('totalYenVal');

  function calculateKasanTotal() {
    let baseUnits = 4500; // 基本サービス単位数
    let totalAdded = 0;

    kasanCheckboxes.forEach(cb => {
      if (cb.checked) {
        totalAdded += parseInt(cb.dataset.units, 10);
      }
    });

    const grandTotal = baseUnits + totalAdded;
    const estimatedYen = grandTotal * 10.45; // 1単位10.45円換算 (地域区分等)

    if (totalUnitsVal) totalUnitsVal.textContent = grandTotal.toLocaleString();
    if (totalYenVal) totalYenVal.textContent = `¥${Math.round(estimatedYen).toLocaleString()}`;
  }

  kasanCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateKasanTotal);
  });

  // Kanban Card Drag/Click Transition
  const kanbanCards = document.querySelectorAll('.kanban-card');
  kanbanCards.forEach(card => {
    card.addEventListener('click', () => {
      const colPreparing = document.getElementById('kanbanColPreparing');
      const colSubmitted = document.getElementById('kanbanColSubmitted');
      const colDone = document.getElementById('kanbanColDone');

      if (card.dataset.state === 'todo' && colPreparing) {
        card.dataset.state = 'preparing';
        colPreparing.appendChild(card);
        card.querySelector('.kanban-tag').textContent = '準備中';
        card.querySelector('.kanban-tag').style.background = 'rgba(245, 158, 11, 0.2)';
        card.querySelector('.kanban-tag').style.color = '#fbbf24';
      } else if (card.dataset.state === 'preparing' && colSubmitted) {
        card.dataset.state = 'submitted';
        colSubmitted.appendChild(card);
        card.querySelector('.kanban-tag').textContent = '提出済';
        card.querySelector('.kanban-tag').style.background = 'rgba(2, 132, 199, 0.2)';
        card.querySelector('.kanban-tag').style.color = '#38bdf8';
      } else if (card.dataset.state === 'submitted' && colDone) {
        card.dataset.state = 'done';
        colDone.appendChild(card);
        card.querySelector('.kanban-tag').textContent = '完了';
        card.querySelector('.kanban-tag').style.background = 'rgba(16, 185, 129, 0.2)';
        card.querySelector('.kanban-tag').style.color = '#34d399';
      }
    });
  });

  // ==========================================
  // 5. Tab 4: CSV Verification Engine Logic
  // ==========================================
  const btnImportCSV = document.getElementById('btnImportCSV');
  const csvDiffContainer = document.getElementById('csvDiffContainer');
  const btnFixAllCSV = document.getElementById('btnFixAllCSV');
  const csvSuccessBanner = document.getElementById('csvSuccessBanner');

  if (btnImportCSV) {
    btnImportCSV.addEventListener('click', () => {
      btnImportCSV.disabled = true;
      btnImportCSV.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 国保連CSV解析 & 実績照合中...`;

      setTimeout(() => {
        btnImportCSV.disabled = false;
        btnImportCSV.innerHTML = `<i class="fa-solid fa-file-csv"></i> 国保連実績CSVを取り込んで自動照合`;
        if (csvDiffContainer) csvDiffContainer.style.display = 'block';
        if (csvSuccessBanner) csvSuccessBanner.style.display = 'none';
      }, 1200);
    });
  }

  if (btnFixAllCSV) {
    btnFixAllCSV.addEventListener('click', () => {
      btnFixAllCSV.disabled = true;
      btnFixAllCSV.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 不一致を自動補正中...`;

      setTimeout(() => {
        btnFixAllCSV.disabled = false;
        btnFixAllCSV.innerHTML = `<i class="fa-solid fa-circle-check"></i> AI自動修正を適用`;
        if (csvDiffContainer) csvDiffContainer.style.display = 'none';
        if (csvSuccessBanner) csvSuccessBanner.style.display = 'block';
      }, 1000);
    });
  }

  // ==========================================
  // 6. Tab 5: Staff Stats & Checklist Logic
  // ==========================================
  const selfCheckboxes = document.querySelectorAll('.self-check-cb');
  const checklistProgress = document.getElementById('checklistProgress');
  const checklistPercent = document.getElementById('checklistPercent');

  function updateChecklistProgress() {
    const total = selfCheckboxes.length;
    let checked = 0;
    selfCheckboxes.forEach(cb => { if (cb.checked) checked++; });
    const percent = Math.round((checked / total) * 100);

    if (checklistProgress) checklistProgress.style.width = `${percent}%`;
    if (checklistPercent) checklistPercent.textContent = `${percent}%`;
  }

  selfCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateChecklistProgress);
  });

  // ==========================================
  // 7. Tab 6: Mobile / PC Layout Switcher Logic
  // ==========================================
  const btnDeviceDesktop = document.getElementById('btnDeviceDesktop');
  const btnDeviceMobile = document.getElementById('btnDeviceMobile');
  const viewDesktopDemo = document.getElementById('viewDesktopDemo');
  const viewMobileDemo = document.getElementById('viewMobileDemo');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const mobileScreenBody = document.getElementById('mobileScreenBody');

  if (btnDeviceDesktop && btnDeviceMobile) {
    btnDeviceDesktop.addEventListener('click', () => {
      btnDeviceDesktop.classList.add('active');
      btnDeviceMobile.classList.remove('active');
      viewDesktopDemo.style.display = 'block';
      viewMobileDemo.style.display = 'none';
    });

    btnDeviceMobile.addEventListener('click', () => {
      btnDeviceMobile.classList.add('active');
      btnDeviceDesktop.classList.remove('active');
      viewDesktopDemo.style.display = 'none';
      viewMobileDemo.style.display = 'block';
    });
  }

  const mobileScreens = {
    home: `
      <div style="background: rgba(2, 132, 199, 0.15); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;">
        <h5 style="color: #38bdf8; font-size: 0.9rem;">👋 今日の訪問・タスク</h5>
        <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.2rem;">本日の予定: 4件の定期モニタリング</p>
      </div>
      <div style="background: #1e293b; border-radius: 10px; padding: 0.85rem; border: 1px solid rgba(255,255,255,0.1);">
        <span style="font-size: 0.75rem; color: #fbbf24; font-weight:700;">⚠️ 認定期限アラート (1件)</span>
        <p style="font-size: 0.8rem; color: #e2e8f0; margin-top: 0.3rem;">山田 和子 様 (要介護2) - 残り12日</p>
      </div>
    `,
    users: `
      <h5 style="color: #f8fafc; font-size: 0.9rem; margin-bottom: 0.5rem;">📱 モバイル利用者カード一覧</h5>
      <div style="background: #1e293b; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem; border-left: 4px solid #ef4444;">
        <strong style="color: #fff; font-size: 0.85rem;">高橋 健太郎 様 (要介護3)</strong>
        <p style="font-size: 0.75rem; color: #f87171;">認定期間: 2026/08/15 (期限切れ)</p>
      </div>
      <div style="background: #1e293b; border-radius: 8px; padding: 0.75rem; border-left: 4px solid #fbbf24;">
        <strong style="color: #fff; font-size: 0.85rem;">山田 和子 様 (要介護2)</strong>
        <p style="font-size: 0.75rem; color: #fbbf24;">認定期間: 2026/08/27 (残り12日)</p>
      </div>
    `,
    kasan: `
      <h5 style="color: #f8fafc; font-size: 0.9rem; margin-bottom: 0.5rem;">⚡ タッチ最適化 加算トグル</h5>
      <div style="background: #1e293b; border-radius: 8px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.8rem; color: #fff;">初回加算 (+300単位)</span>
        <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: #0284c7;">
      </div>
      <div style="background: #1e293b; border-radius: 8px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; color: #fff;">認知症加算 (+150単位)</span>
        <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: #0284c7;">
      </div>
    `,
    alert: `
      <h5 style="color: #fbbf24; font-size: 0.9rem; margin-bottom: 0.5rem;">🔔 プッシュ通知履歴</h5>
      <p style="font-size: 0.8rem; color: #94a3b8;">・高橋様の認定有効期限が切れました (08/15)</p>
      <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.4rem;">・月遅れ請求データの準備が整いました</p>
    `
  };

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const screenKey = item.dataset.screen;
      if (mobileScreenBody && mobileScreens[screenKey]) {
        mobileScreenBody.innerHTML = mobileScreens[screenKey];
      }
    });
  });

  // ==========================================
  // 8. Tab 7: Multi-tenant Security Switcher Logic
  // ==========================================
  const tenantSelect = document.getElementById('tenantSelect');
  const currentOrgName = document.getElementById('currentOrgName');
  const rlsTenantLog = document.getElementById('rlsTenantLog');
  const tenantUserCount = document.getElementById('tenantUserCount');
  const tenantSalesCount = document.getElementById('tenantSalesCount');

  if (tenantSelect) {
    tenantSelect.addEventListener('change', () => {
      const selectedTenant = tenantSelect.value;
      if (selectedTenant === 'himawari') {
        if (currentOrgName) currentOrgName.textContent = 'ひまわり介護サービス（東京本社）';
        if (tenantUserCount) tenantUserCount.textContent = '148 名';
        if (tenantSalesCount) tenantSalesCount.textContent = '¥4,820,000';
        if (rlsTenantLog) {
          rlsTenantLog.innerHTML = `
            <div>[Supabase RLS Policy Triggered]</div>
            <div>QUERY: SELECT * FROM clients WHERE tenant_id = 'org_himawari_01';</div>
            <div>STATUS: 200 OK (Row-Level Security boundary verified)</div>
            <div>ISOLATION LEVEL: STRICT_TENANT_ISOLATED</div>
          `;
        }
      } else if (selectedTenant === 'sakura') {
        if (currentOrgName) currentOrgName.textContent = 'さくら訪問介護ステーション（横浜）';
        if (tenantUserCount) tenantUserCount.textContent = '82 名';
        if (tenantSalesCount) tenantSalesCount.textContent = '¥2,650,000';
        if (rlsTenantLog) {
          rlsTenantLog.innerHTML = `
            <div>[Supabase RLS Policy Triggered]</div>
            <div>QUERY: SELECT * FROM clients WHERE tenant_id = 'org_sakura_02';</div>
            <div>STATUS: 200 OK (Row-Level Security boundary verified)</div>
            <div>ISOLATION LEVEL: STRICT_TENANT_ISOLATED</div>
          `;
        }
      }
    });
  }

  // ==========================================
  // 9. Panel 0: Real UI (v3.36.0) Interactive Handlers
  // ==========================================
  const btnCsvBulkDemo = document.getElementById('btnCsvBulkDemo');
  const monthDelayBtns = document.querySelectorAll('.lc-btn-month-delay');
  const kasanSetBtns = document.querySelectorAll('.lc-btn-kasan-set');

  if (btnCsvBulkDemo) {
    btnCsvBulkDemo.addEventListener('click', () => {
      const origText = btnCsvBulkDemo.innerHTML;
      btnCsvBulkDemo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CSV照合中...';
      btnCsvBulkDemo.style.opacity = '0.8';

      setTimeout(() => {
        btnCsvBulkDemo.innerHTML = '<i class="fa-solid fa-circle-check"></i> CSV照合完了!';
        btnCsvBulkDemo.style.background = '#10b981';
        btnCsvBulkDemo.style.opacity = '1';

        setTimeout(() => {
          btnCsvBulkDemo.innerHTML = origText;
          btnCsvBulkDemo.style.background = '#0f172a';
        }, 2500);
      }, 1200);
    });
  }

  monthDelayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tr = btn.closest('tr');
      const name = tr ? tr.querySelector('.lc-user-fullname').innerText.split(' ')[0] : '対象者';
      
      if (btn.classList.contains('active-delay')) {
        btn.classList.remove('active-delay');
        btn.innerText = '月遅れ請求';
        btn.style.background = '#f8fafc';
        btn.style.color = '#334155';
        alert(`【月遅れ解除】${name}様の請求ステータスを「通常請求」に戻しました。`);
      } else {
        btn.classList.add('active-delay');
        btn.innerText = '月遅れ処理済';
        btn.style.background = '#f59e0b';
        btn.style.color = '#ffffff';
        alert(`【月遅れ登録】${name}様を「月遅れ請求対象」に登録しました。翌月請求データへ自動繰り越されます。`);
      }
    });
  });

  kasanSetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tr = btn.closest('tr');
      const name = tr ? tr.querySelector('.lc-user-fullname').innerText.split(' ')[0] : '対象者';
      const kasanChoice = prompt(`【加算設定】${name}様に設定する加算を選択・入力してください:`, '初回加算, 入院時情報連携加算(II)');
      if (kasanChoice) {
        const td = btn.parentElement;
        td.innerHTML = `<div class="lc-kasan-pill pill-green">${kasanChoice}</div>`;
      }
    });
  });

  // ==========================================
  // CareDoc AI Tab Navigation Logic
  // ==========================================
  const caredocTabBtns = document.querySelectorAll('.caredoc-tab-btn');
  const caredocPanels = document.querySelectorAll('.caredoc-panel');

  caredocTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      caredocTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      caredocPanels.forEach(p => {
        if (p.id === `panel-${targetId}`) {
          p.style.display = 'block';
          p.classList.add('active');
        } else {
          p.style.display = 'none';
          p.classList.remove('active');
        }
      });
    });
  });

});

