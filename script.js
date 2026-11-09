'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav__links');
  var dropdownButton = document.querySelector('.dropdown-toggle');
  var dropdown = document.querySelector('.nav__dropdown');
  var form = document.querySelector('#contact-form');
  var status = document.querySelector('.form-status');
  var fallbackRedirect = form.querySelector('[name="_redirect"]');
  fallbackRedirect.value = window.location.href.split('?')[0];

  var reviews = [
    { brand: 'CIEL', title: 'Надёжная поддержка проекта', text: 'Команда Drupal-coder помогает нам развивать сайт, быстро решает возникающие задачи и предлагает взвешенные технические решения. Мы ценим прозрачный процесс работы и внимательное отношение к проекту.', author: 'Команда CIEL' },
    { brand: 'LPCMA', title: 'Сайт развивается вместе с проектом', text: 'Специалисты помогают поддерживать сайт в рабочем состоянии, оперативно разбираются с задачами и предлагают понятные решения для дальнейшего развития.', author: 'Команда медицинского центра' },
    { brand: 'Cableman', title: 'Оперативная работа над задачами', text: 'Команда внимательно относится к деталям, помогает улучшать сервис и держит нас в курсе хода работ. Сотрудничество помогает планомерно развивать проект.', author: 'Команда Cableman' },
    { brand: 'Estée Lauder', title: 'Внимание к качеству и деталям', text: 'Нам важно, чтобы сайт оставался удобным и стабильным. Команда помогает решать технические вопросы и последовательно улучшать пользовательский опыт.', author: 'Команда проекта' }
  ];
  var reviewIndex = 0;
  var reviewFields = {
    brand: document.querySelector('[data-review-brand]'),
    title: document.querySelector('[data-review-title]'),
    text: document.querySelector('[data-review-text]'),
    author: document.querySelector('[data-review-author]'),
    count: document.querySelector('[data-review-count]')
  };
  function showReview(index) {
    reviewIndex = (index + reviews.length) % reviews.length;
    var review = reviews[reviewIndex];
    reviewFields.brand.textContent = review.brand;
    reviewFields.title.textContent = review.title;
    reviewFields.text.textContent = review.text;
    reviewFields.author.textContent = review.author;
    reviewFields.count.textContent = String(reviewIndex + 1).padStart(2, '0') + ' / ' + String(reviews.length).padStart(2, '0');
  }
  document.querySelector('[data-review-prev]').addEventListener('click', function () { showReview(reviewIndex - 1); });
  document.querySelector('[data-review-next]').addEventListener('click', function () { showReview(reviewIndex + 1); });

  menuButton.addEventListener('click', function () {
    var expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Открыть меню' : 'Закрыть меню');
    menu.classList.toggle('is-open', !expanded);
  });

  dropdownButton.addEventListener('click', function () {
    var expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    dropdownButton.setAttribute('aria-expanded', String(!expanded));
    dropdown.classList.toggle('is-open', !expanded);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
    });
  });

  document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('is-open');
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      menu.classList.remove('is-open');
      dropdown.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем…';
    status.textContent = 'Отправляем вашу заявку…';
    status.removeAttribute('data-state');

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });

      if (!response.ok) throw new Error('FormSpark response: ' + response.status);
      form.reset();
      status.textContent = 'Спасибо! Ваша заявка отправлена.';
      status.setAttribute('data-state', 'success');
    } catch (error) {
      status.textContent = 'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.';
      status.setAttribute('data-state', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Оставить заявку';
    }
  });
});
