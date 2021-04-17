'use strict';

const FRONTEND_URL = `http://localhost:8080`;

const socket = io(FRONTEND_URL);
const commentForm = document.querySelector(`.comment-form`);
const commentText = document.querySelector(`.comment-text`);
const lastList = document.querySelector(`.last__list`);
const lastComments = document.querySelectorAll(`.last__list-item`);


if (commentForm) {
  commentForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();

    const {value: username} = commentForm.querySelector(`input[name='username']`);
    const {value: comment} = commentText;

    const commentJson = {
      username,
      comment,
      articleUrl: location.pathname,
    };

    if (!socket.connected) {
      // eslint-disable-next-line no-alert,no-undef
      alert(`Соединение с сервером прервано. Обновите страницу.`);
      return;
    }

    socket.emit(`message`, JSON.stringify(commentJson));
    commentForm.submit();
  });
}


const addLastComment = (message) => {
  const {comment, avatar, user, articleUrl} = JSON.parse(message);
  const newItem = document.createElement(`li`);
  newItem.classList.add(`last__list-item`);
  const newImg = document.createElement(`img`);
  newImg.classList.add(`last__list-image`);
  newImg.setAttribute(`src`, `/upload/${avatar}`);
  newImg.setAttribute(`width`, `20`);
  newImg.setAttribute(`height`, `20`);
  newImg.setAttribute(`alt`, `Аватар пользователя`);
  newItem.appendChild(newImg);
  const newTitle = document.createElement(`b`);
  newTitle.classList.add(`last__list-name`);
  newTitle.textContent = user;
  newItem.appendChild(newTitle);
  const newComment = document.createElement(`a`);
  newComment.classList.add(`last__list-link`);
  newComment.setAttribute(`href`, `${articleUrl}`);
  newComment.textContent = comment;
  newItem.appendChild(newComment);

  const lastItem = document.querySelector(`.last__list-item:last-child`);
  lastItem.remove();

  const firstItem = document.querySelector(`.last__list-item:first-child`);
  lastList.insertBefore(newItem, firstItem);
};


if (lastComments) {
  socket.addEventListener(`message`, (message) => {
    addLastComment(message);
  });
}

socket.addEventListener(`connect`, () => {
  console.log(`Подключено`);
});

socket.addEventListener(`disconnect`, () => {
  console.log(`Отключён`);
});
