'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav__links');
  var dropdownButton = document.querySelector('.dropdown-toggle');
  var dropdown = document.querySelector('.nav__dropdown');
  var form = document.querySelector('#contact-form');
  var status = document.querySelector('.form-status');

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
