/**
 * Care Mane DX Lab - Portfolio Website Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- DEMO SIMULATOR LOGIC ---
  const btnRunSortDemo = document.getElementById('btnRunSortDemo');
  const btnResetDemo = document.getElementById('btnResetDemo');

  const unsortedCount = document.getElementById('unsortedCount');
  const sortedCount = document.getElementById('sortedCount');
  const unsortedList = document.getElementById('unsortedList');

  const yamadaContents = document.getElementById('yamadaContents');
  const satoContents = document.getElementById('satoContents');
  const takahashiContents = document.getElementById('takahashiContents');
  const demoSuccessMsg = document.getElementById('demoSuccessMsg');

  let isDemoSorted = false;

  if (btnRunSortDemo) {
    btnRunSortDemo.addEventListener('click', runSortAnimation);
    btnResetDemo.addEventListener('click', resetSortAnimation);
  }

  function runSortAnimation() {
    if (isDemoSorted) return;

    btnRunSortDemo.disabled = true;
    btnRunSortDemo.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI自動解析 & 仕分け中...`;

    const itemA = document.querySelector('.item-a');
    const itemB = document.querySelector('.item-b');
    const itemC = document.querySelector('.item-c');

    setTimeout(() => {
      if (itemA) {
        yamadaContents.innerHTML = `<div class="file-item item-a"><i class="fa-solid fa-file-lines text-danger"></i> 202608_山田様_訪問看護指示書.pdf</div>`;
        itemA.remove();
        unsortedCount.textContent = "2";
        sortedCount.textContent = "1";
      }
    }, 400);

    setTimeout(() => {
      if (itemB) {
        satoContents.innerHTML = `<div class="file-item item-b"><i class="fa-solid fa-file-lines text-primary"></i> 佐藤様_第2表ケアプラン_確定.pdf</div>`;
        itemB.remove();
        unsortedCount.textContent = "1";
        sortedCount.textContent = "2";
      }
    }, 800);

    setTimeout(() => {
      if (itemC) {
        takahashiContents.innerHTML = `<div class="file-item item-c"><i class="fa-solid fa-file-lines text-warning"></i> 高橋様_主治医意見書_スキャン.pdf</div>`;
        itemC.remove();
        unsortedCount.textContent = "0";
        sortedCount.textContent = "3";
        unsortedList.innerHTML = `<div class="text-muted text-sm" style="padding: 0.5rem 0;">すべての書類の仕分けが完了しました</div>`;
      }

      btnRunSortDemo.disabled = false;
      btnRunSortDemo.innerHTML = `<i class="fa-solid fa-check"></i> 自動仕分け完了`;
      demoSuccessMsg.classList.remove('style-hidden');
      isDemoSorted = true;
    }, 1200);
  }

  function resetSortAnimation() {
    isDemoSorted = false;
    unsortedCount.textContent = "3";
    sortedCount.textContent = "0";
    demoSuccessMsg.classList.add('style-hidden');

    btnRunSortDemo.disabled = false;
    btnRunSortDemo.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ワンクリックで自動仕分けを実行`;

    unsortedList.innerHTML = `
      <div class="file-item item-a"><i class="fa-solid fa-file-lines text-danger"></i> 202608_山田様_訪問看護指示書.pdf</div>
      <div class="file-item item-b"><i class="fa-solid fa-file-lines text-primary"></i> 佐藤様_第2表ケアプラン_確定.pdf</div>
      <div class="file-item item-c"><i class="fa-solid fa-file-lines text-warning"></i> 高橋様_主治医意見書_スキャン.pdf</div>
    `;

    yamadaContents.innerHTML = `<span class="empty-text">空</span>`;
    satoContents.innerHTML = `<span class="empty-text">空</span>`;
    takahashiContents.innerHTML = `<span class="empty-text">空</span>`;
  }

  // --- CONTACT FORM LOGIC ---
  const portfolioContactForm = document.getElementById('portfolioContactForm');
  const contactSuccessAlert = document.getElementById('contactSuccessAlert');

  if (portfolioContactForm) {
    portfolioContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = portfolioContactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 送信中...`;

      setTimeout(() => {
        portfolioContactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> 送信する（無料）`;
        contactSuccessAlert.classList.remove('style-hidden');

        setTimeout(() => {
          contactSuccessAlert.classList.add('style-hidden');
        }, 6000);
      }, 1000);
    });
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});
