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

  var aiModeTabs = Array.prototype.slice.call(document.querySelectorAll('[data-ai-mode]'));
  var aiModePanels = Array.prototype.slice.call(document.querySelectorAll('.ai-mode-panel'));
  aiModeTabs.forEach(function (tab, tabIndex) {
    tab.addEventListener('click', function () {
      var mode = tab.getAttribute('data-ai-mode');
      aiModeTabs.forEach(function (item) {
        var isActive = item === tab;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });
      aiModePanels.forEach(function (panel) {
        panel.hidden = panel.id !== 'ai-panel-' + mode;
      });
    });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      var offset = event.key === 'ArrowRight' ? 1 : -1;
      var nextTab = aiModeTabs[(tabIndex + offset + aiModeTabs.length) % aiModeTabs.length];
      nextTab.focus();
      nextTab.click();
    });
  });

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

  var aiChatForm = document.getElementById('ai-chat-form');
  if (aiChatForm) {
    var aiChatInput = document.getElementById('ai-chat-input');
    var aiChatSend = document.getElementById('ai-chat-send');
    var aiChatMessages = document.getElementById('ai-chat-messages');
    var aiChatEmpty = document.getElementById('ai-chat-empty');
    var aiChatClear = document.getElementById('ai-chat-clear');
    var aiChatStatus = document.getElementById('ai-chat-status');
    var chatHistory = [];

    function appendChatMessage(role, content) {
      var article = document.createElement('article');
      var label = document.createElement('span');
      var text = document.createElement('p');
      article.className = 'ai-chat-message ' + role;
      label.className = 'ai-chat-message-role';
      label.textContent = role === 'user' ? 'Anda' : 'SparkMind AI';
      text.textContent = content;
      article.appendChild(label);
      article.appendChild(text);
      if (aiChatEmpty) aiChatEmpty.hidden = true;
      aiChatMessages.appendChild(article);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      return article;
    }

    aiChatForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var message = aiChatInput ? aiChatInput.value.trim() : '';
      if (!message || !aiChatSend || !aiChatMessages || !aiChatStatus) return;

      var requestMessages = chatHistory.concat([{ role: 'user', content: message }]);
      var pendingBubble = appendChatMessage('user', message);
      aiChatInput.value = '';
      aiChatSend.disabled = true;
      aiChatSend.classList.add('loading');
      aiChatSend.querySelector('span').textContent = 'Mengirim';
      aiChatStatus.textContent = 'Gemini sedang menyiapkan balasan…';
      aiChatStatus.className = 'ai-chat-status working';

      fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: requestMessages })
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
            throw new Error(result.payload.error || 'Percakapan AI tidak dapat diproses.');
          }
          chatHistory = requestMessages.concat([{ role: 'assistant', content: result.payload.reply }]);
          appendChatMessage('assistant', result.payload.reply);
          aiChatStatus.textContent = 'Balasan diterima. Riwayat tetap tersimpan hanya di tab ini.';
          aiChatStatus.className = 'ai-chat-status success';
          if (aiChatClear) aiChatClear.disabled = false;
        })
        .catch(function (error) {
          pendingBubble.remove();
          if (chatHistory.length === 0 && aiChatEmpty) aiChatEmpty.hidden = false;
          aiChatInput.value = message;
          aiChatStatus.textContent = error.message || 'Terjadi gangguan saat menghubungi layanan AI.';
          aiChatStatus.className = 'ai-chat-status failed';
        })
        .finally(function () {
          aiChatSend.disabled = false;
          aiChatSend.classList.remove('loading');
          aiChatSend.querySelector('span').textContent = 'Kirim';
          aiChatInput.focus();
        });
    });

    if (aiChatClear) {
      aiChatClear.addEventListener('click', function () {
        chatHistory = [];
        aiChatMessages.querySelectorAll('.ai-chat-message').forEach(function (message) { message.remove(); });
        if (aiChatEmpty) aiChatEmpty.hidden = false;
        aiChatClear.disabled = true;
        aiChatStatus.textContent = 'Percakapan di tab ini sudah dihapus.';
        aiChatStatus.className = 'ai-chat-status';
        aiChatInput.focus();
      });
    }
  }

  var aiImageForm = document.getElementById('ai-image-form');
  if (aiImageForm) {
    var aiImagePrompt = document.getElementById('ai-image-prompt');
    var aiImageButton = document.getElementById('ai-image-button');
    var aiImageStatus = document.getElementById('ai-image-status');
    var aiImageOutput = document.getElementById('ai-image-output');
    var aiImageCanvas = document.getElementById('ai-image-canvas');
    var aiImageTitle = document.getElementById('ai-image-preview-title');
    var aiImageDownload = document.getElementById('ai-image-download');

    aiImageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var prompt = aiImagePrompt ? aiImagePrompt.value.trim() : '';
      if (!prompt || !aiImageButton || !aiImageStatus || !aiImageOutput || !aiImageCanvas || !aiImageTitle || !aiImageDownload) return;

      aiImageButton.disabled = true;
      aiImageButton.classList.add('loading');
      aiImageButton.querySelector('span').textContent = 'Membuat';
      aiImageStatus.textContent = 'Gemini sedang membuat gambar. Proses ini dapat memerlukan beberapa saat…';
      aiImageStatus.className = 'ai-chat-status working';
      aiImageTitle.textContent = 'Gambar sedang dibuat.';

      fetch('/api/ai/generate-image', {
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
            throw new Error(result.payload.error || 'Gambar tidak dapat dibuat.');
          }
          var imageUrl = 'data:' + result.payload.mimeType + ';base64,' + result.payload.imageBase64;
          aiImageOutput.src = imageUrl;
          aiImageOutput.hidden = false;
          aiImageCanvas.classList.add('has-image');
          aiImageDownload.href = imageUrl;
          aiImageDownload.hidden = false;
          aiImageTitle.textContent = 'Gambar berhasil dibuat.';
          aiImageStatus.textContent = 'Selesai. Gambar tersedia hanya di halaman ini dan tidak disimpan oleh aplikasi.';
          aiImageStatus.className = 'ai-chat-status success';
        })
        .catch(function (error) {
          aiImageTitle.textContent = 'Pembuatan gambar belum berhasil.';
          aiImageStatus.textContent = error.message || 'Terjadi gangguan saat menghubungi layanan gambar AI.';
          aiImageStatus.className = 'ai-chat-status failed';
        })
        .finally(function () {
          aiImageButton.disabled = false;
          aiImageButton.classList.remove('loading');
          aiImageButton.querySelector('span').textContent = 'Generate';
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
