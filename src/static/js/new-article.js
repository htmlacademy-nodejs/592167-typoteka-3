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
const buttonSubmitForm = document.querySelector(`#submitMainForm`);
// eslint-disable-next-line no-undef
const buttonSubmitFake = document.querySelector(`.new-publication__button`);
// eslint-disable-next-line no-undef
const buttonsDeleteCategory = document.querySelectorAll(`.js-delete-category`);
// eslint-disable-next-line no-undef
const buttonsDeleteComment = document.querySelectorAll(`.publication__button`);
// eslint-disable-next-line no-undef
const editArticlesList = document.querySelectorAll(`.notes__item-text`);
// eslint-disable-next-line no-undef
const buttonsDeleteArticle = document.querySelectorAll(`.notes__button`);

// Набор полей для модального окна
// eslint-disable-next-line no-undef
const newArticleTitle = document.querySelector(`#newArticleTitle`);
// eslint-disable-next-line no-undef
const articleCreateAt = document.querySelector(`#new-publication-date`);
// eslint-disable-next-line no-undef
const imageNameField = document.querySelector(`#image-name-field`);
// eslint-disable-next-line no-undef
const newArticleAnnounce = document.querySelector(`#newArticleAnnounce`);
// eslint-disable-next-line no-undef
const newArticleFullText = document.querySelector(`#newArticleFullText`);
// eslint-disable-next-line no-undef
const newPublicationCheckbox = document.querySelectorAll(`.new-publication__checkbox`);


buttonNewArticle.addEventListener(`click`, () => {
  newArticleForm.action = `${BACKEND_URL}/api/articles/add`;
  newArticleModal.classList.remove(`invisible-block`);
});

if (buttonPopupClose) {
  buttonPopupClose.addEventListener(`click`, () => {
    newArticleTitle.value = ``;
    articleCreateAt.value = ``;
    imageNameField.value = ``;
    newArticleAnnounce.value = ``;
    newArticleFullText.value = ``;
    for (let category of newPublicationCheckbox) {
      const checkboxCategory = category.querySelector(`input`);
      checkboxCategory.checked = false;
    }

    newArticleModal.classList.add(`invisible-block`);
  });
}

if (buttonSubmitFake) {
  buttonSubmitFake.addEventListener(`click`, () => {
    buttonSubmitForm.click();
    // newArticleModal.classList.add(`invisible-block`);
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

const fillArticleModal = (data) => {
  newArticleForm.action = `${BACKEND_URL}/api/articles/edit/${data.articleId}`;
  newArticleTitle.value = data.title;
  articleCreateAt.value = data.createdAt.slice(0, 10);
  imageNameField.value = data.image;
  newArticleAnnounce.value = data.announce;
  newArticleFullText.value = data.description;
  for (let [idx, category] of newPublicationCheckbox.entries()) {
    const categoryLabel = category.querySelector(`label`);
    if (data.categories[idx].isChecked) {
      categoryLabel.click();
    }
  }

  newArticleModal.classList.remove(`invisible-block`);
};

if (editArticlesList) {
  for (let articleLink of editArticlesList) {
    articleLink.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const articleId = evt.target.getAttribute(`data-articleId`);
      // eslint-disable-next-line no-undef
      fetch(`${BACKEND_URL}/api/articles/${articleId}?extension=isFetch`, {
        mode: `cors`,
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
      }).then((response) => {
        return response.json();
      }).then((data) => {
        fillArticleModal(data);
      }).catch((err) => {
        console.error(err);
      });
    });
  }
}

