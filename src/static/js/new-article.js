'use strict';

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
const buttonsDelete = document.querySelectorAll(`.js-delete-category`);

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

if (buttonsDelete) {
  for (let i = 0; i < buttonsDelete.length; i++) {
    buttonsDelete[i].addEventListener(`click`, (evt) => {
      // console.log(evt.target.parentElement.action);
      const form = evt.target.parentElement;
      let removeUrl = form.action.slice(0, -4);
      removeUrl = `${removeUrl}delete`;
      form.action = removeUrl;
      form.submit();
    });
  }
  // buttonsDelete.addEventListener(`click`, (evt) => {
  //   console.log(evt.target.parentElement());
  // });
  console.log(buttonsDelete);
}
