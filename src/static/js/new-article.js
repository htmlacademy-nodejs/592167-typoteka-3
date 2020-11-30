'use strict';

const BACKEND_URL = `http://localhost:8081`;

// eslint-disable-next-line no-undef
const buttonNewArticle = document.querySelector(`.header__button-new`);
// eslint-disable-next-line no-undef
const newArticleModal = document.querySelector(`#newArticleModal`);
// eslint-disable-next-line no-undef
const buttonPopupClose = document.querySelector(`.button--popup-close`);
// eslint-disable-next-line no-undef
const newArticleForm = document.querySelector(`#newArticleForm`);
// eslint-disable-next-line no-undef
const buttonSubmitForm = document.querySelector(`.new-publication__button`);
// eslint-disable-next-line no-undef
const buttonsDeleteCategory = document.querySelectorAll(`.js-delete-category`);
// eslint-disable-next-line no-undef
const buttonsDeleteComment = document.querySelectorAll(`.button--close-item`);

buttonNewArticle.addEventListener(`click`, () => {
  newArticleModal.classList.remove(`invisible-block`);
});

if (buttonPopupClose) {
  buttonPopupClose.addEventListener(`click`, () => {
    newArticleModal.classList.add(`invisible-block`);
  });
}

if (buttonSubmitForm) {
  buttonSubmitForm.addEventListener(`click`, () => {
    newArticleForm.submit();
    newArticleModal.classList.add(`invisible-block`);
  });
}

if (buttonsDeleteCategory) {
  for (let i = 0; i < buttonsDeleteCategory.length; i++) {
    buttonsDeleteCategory[i].addEventListener(`click`, (evt) => {
      const form = evt.target.parentElement;
      let removeUrl = form.action.slice(0, -4);
      removeUrl = `${removeUrl}delete`;
      form.action = removeUrl;
      form.submit();
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
