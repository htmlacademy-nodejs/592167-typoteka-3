'use strict';

const buttonNewArticle = document.querySelector(`.header__button-new`);
const newArticleModal = document.querySelector(`#newArticleModal`);
const buttonPopupClose = document.querySelector(`.button--popup-close`);
const newArticleForm = document.querySelector(`#newArticleForm`);
const buttonSubmitForm = document.querySelector(`.new-publication__button`);

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
