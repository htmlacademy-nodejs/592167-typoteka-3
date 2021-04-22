'use strict';

const BACKEND_URL = `http://localhost:8081`;

// eslint-disable-next-line no-undef
const buttonNewArticle = document.querySelector(`.header__button-new`);
// eslint-disable-next-line no-undef
const buttonsDeleteCategory = document.querySelectorAll(`.js-delete-category`);
// eslint-disable-next-line no-undef
const buttonsDeleteComment = document.querySelectorAll(`.publication__button`);
// eslint-disable-next-line no-undef
const buttonsDeleteArticle = document.querySelectorAll(`.notes__button`);
// eslint-disable-next-line no-undef
const buttonPostBackwards = document.querySelector(`.post__backwards`);
const newPublicationForm = document.querySelector(`.js-publication-form`);
const newPublication = document.querySelector(`.new-publication__button`);
const newPublicationDate = document.querySelector(`#new-publication-date`);
const newPublicationDateForm = document.querySelector(`.new-publication__date-form`);
const newPublicationTitle = document.querySelector(`#new-publication-title`);
const errorNewPublicationTitle = document.querySelector(`#error-new-publication-title`);
const viewErrorsList = document.querySelector(`.js-errors-list`);
const newPublicationAnnouncement = document.querySelector(`#new-publication-announcement`);
const errorNewPublicationAnnouncement = document.querySelector(`#error-new-publication-announcement`);
const errorNewPublicationCategory = document.querySelector(`#error-new-publication-category`);


if (buttonNewArticle) {
  buttonNewArticle.addEventListener(`click`, () => {
    // eslint-disable-next-line no-undef
    location.pathname = `/articles/add`;
  });
}

if (buttonPostBackwards) {
  buttonPostBackwards.addEventListener(`click`, (evt) => {
    // eslint-disable-next-line no-undef
    history.back();
    evt.preventDefault();
  });
}

if (buttonsDeleteCategory) {
  for (let i = 0; i < buttonsDeleteCategory.length; i++) {
    buttonsDeleteCategory[i].addEventListener(`click`, (evt) => {
      const form = evt.target.parentElement;
      let removeUrl = form.action.slice(0, -4);
      removeUrl = `${removeUrl}delete`;
      // eslint-disable-next-line no-undef
      fetch(removeUrl, {
        mode: `cors`,
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
      }).then((response) => response.json())
        .then((data) => {
          if (data.isDelete) {
            // eslint-disable-next-line no-undef
            location.reload();
          } else {
            // eslint-disable-next-line no-undef
            const spanElement = document.querySelector(`.delete-error`);
            const categoryName = form.querySelector(`input[name='category']`).value;
            spanElement.textContent = `Удаление невозможно, для категории "${categoryName}" есть публикации.`;
          }
        });
      // form.action = removeUrl;
      // form.submit();
    });
  }
}

if (buttonsDeleteComment) {
  for (let btnCategory of buttonsDeleteComment) {
    btnCategory.addEventListener(`click`, (evt) => {
      const commentId = evt.target.getAttribute(`data-commentId`);
      // eslint-disable-next-line no-undef
      fetch(`${BACKEND_URL}/api/comments/delete/${commentId}`, {
        mode: `cors`,
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
      }).then((response) => response.json())
        .then((data) => {
          if (data.isDelete) {
            // eslint-disable-next-line no-undef
            location.reload();
          }
        });
    });
  }
}

if (buttonsDeleteArticle) {
  for (let btnArticle of buttonsDeleteArticle) {
    btnArticle.addEventListener(`click`, (evt) => {
      const articleId = evt.target.getAttribute(`data-articleId`);
      // eslint-disable-next-line no-undef
      fetch(`${BACKEND_URL}/api/articles/delete/${articleId}`, {
        mode: `cors`,
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
      }).then((response) => response.json())
        .then((data) => {
          if (data.isDelete) {
            // eslint-disable-next-line no-undef
            location.reload();
          }
        });
    });
  }
}

if (newPublication) {
  newPublication.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    const errorsList = [];
    viewErrorsList.innerHTML = ``;

    if (newPublicationDate.value === ``) {
      newPublicationDateForm.classList.add(`error-new-publication-date-form`);
      errorsList.push(`Поле "Дата публикации" обязательно для заполнения`);
    } else {
      newPublicationDateForm.classList.remove(`error-new-publication-date-form`);
    }

    if (newPublicationTitle.value === ``) {
      errorNewPublicationTitle.textContent = `Поле "Заголовок" обязательно для заполнения`;
      errorsList.push(`Поле "Заголовок" обязательно для заполнения`);
    } else {
      errorNewPublicationTitle.textContent = ``;
    }

    if (newPublicationAnnouncement.value === ``) {
      errorNewPublicationAnnouncement.textContent = `Поле "Анонс" обязательно для заполнения`;
      errorsList.push(`Поле "Анонс" обязательно для заполнения`);
    } else {
      errorNewPublicationAnnouncement.textContent = ``;
    }

    const checkboxCategory = document.querySelector(`input[name='checkbox-category']:checked`);
    if (!checkboxCategory) {
      errorNewPublicationCategory.textContent = `Выберите хотя бы одну из категорий`;
      errorsList.push(`Выберите хотя бы одну из категорий`);
    } else {
      errorNewPublicationCategory.textContent = ``;
    }

    if (errorsList.length > 0) {
      errorsList.forEach((it) => {
        const liItem = document.createElement(`li`);
        liItem.classList.add(`error-text`);
        liItem.textContent = it;
        viewErrorsList.appendChild(liItem);
      });
    } else {
      newPublicationForm.submit();
    }
  });
}
