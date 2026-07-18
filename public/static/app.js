// SparkMind — small progressive enhancements for the public site
(function () {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    });
  }

  var filterButtons = document.querySelectorAll('.filter-button');
  var articleRows = document.querySelectorAll('[data-article-category]');
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var category = button.getAttribute('data-category');
      filterButtons.forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      articleRows.forEach(function (article) {
        article.hidden = category !== 'Semua' && article.getAttribute('data-article-category') !== category;
      });
    });
  });

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(contactForm);
      var recipient = contactForm.getAttribute('data-recipient');
      var name = String(data.get('name') || '');
      var email = String(data.get('email') || '');
      var message = String(data.get('message') || '');
      var subject = encodeURIComponent('Percakapan baru dari ' + name + ' melalui sparkmind.web.id');
      var body = encodeURIComponent('Nama: ' + name + '\nEmail: ' + email + '\n\nPesan:\n' + message);
      window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
    });
  }

  var aiForm = document.getElementById('ai-generate-form');
  if (aiForm) {
    var aiPrompt = document.getElementById('ai-prompt');
    var aiButton = document.getElementById('ai-generate-button');
    var aiResult = document.getElementById('ai-result');
    var aiResultTitle = document.getElementById('ai-result-title');
    var aiResultStatus = document.getElementById('ai-result-status');

    aiForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var prompt = aiPrompt ? aiPrompt.value.trim() : '';
      if (!prompt || !aiButton || !aiResult || !aiResultTitle || !aiResultStatus) return;

      aiButton.disabled = true;
      aiButton.classList.add('loading');
      aiButton.querySelector('span').textContent = 'Memproses';
      aiResultStatus.textContent = 'Memproses';
      aiResultStatus.className = 'ai-result-status working';
      aiResultTitle.textContent = 'Gateway sedang bekerja.';
      aiResult.textContent = 'Mohon tunggu. Permintaan sedang diproses dengan aman.';

      fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      })
        .then(function (response) {
          return response.json().catch(function () {
            return { ok: false, error: 'Layanan mengembalikan respons yang tidak valid.' };
          }).then(function (payload) {
            return { response: response, payload: payload };
          });
        })
        .then(function (result) {
          if (!result.response.ok || !result.payload.ok) {
            throw new Error(result.payload.error || 'Permintaan AI tidak dapat diproses.');
          }

          aiResultTitle.textContent = 'Jawaban dari AI Gateway.';
          aiResultStatus.textContent = 'Selesai';
          aiResultStatus.className = 'ai-result-status success';
          aiResult.textContent = result.payload.result;
        })
        .catch(function (error) {
          aiResultTitle.textContent = 'Permintaan belum berhasil.';
          aiResultStatus.textContent = 'Gagal';
          aiResultStatus.className = 'ai-result-status failed';
          aiResult.textContent = error.message || 'Terjadi gangguan saat menghubungi AI Gateway.';
        })
        .finally(function () {
          aiButton.disabled = false;
          aiButton.classList.remove('loading');
          aiButton.querySelector('span').textContent = 'Generate';
        });
    });
  }

  var sprintLabel = document.getElementById('sprint-day-label');
  if (sprintLabel) {
    fetch('/api/sprint')
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (typeof data.today === 'number') {
          sprintLabel.textContent = 'D' + data.today + ' / D14';
          var fill = document.querySelector('.progress-fill');
          if (fill) fill.style.width = (data.today / 14 * 100) + '%';
        }
      })
      .catch(function () {});
  }
})();
