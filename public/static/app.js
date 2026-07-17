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
