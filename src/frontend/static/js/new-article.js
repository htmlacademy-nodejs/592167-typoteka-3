'use strict';

const newArticle = document.querySelector(`.header__button-new`);
const newArticleModal = document.querySelector(`#newArticleModal`);
const buttonPopupClose = document.querySelector(`.button--popup-close`);

newArticle.addEventListener(`click`, () => {
  newArticleModal.classList.remove(`invisible-block`);
});

buttonPopupClose.addEventListener(`click`, () => {
  newArticleModal.classList.add(`invisible-block`);
});
