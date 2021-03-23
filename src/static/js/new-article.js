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
