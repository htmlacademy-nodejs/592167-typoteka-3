'use strict';

const FRONTEND_URL = `http://localhost:8080`;

const socket = io(FRONTEND_URL);
const commentForm = document.querySelector(`.comment-form`);
const commentText = document.querySelector(`.comment-text`);
const lastList = document.querySelector(`.last__list`);
const lastComments = document.querySelectorAll(`.last__list-item`);
const commentsList = document.querySelector(`.comments__list`);

const addCommentOnPostPage = (message) => {
  const {comment, avatar, user, createdAt} = JSON.parse(message);
  const newItem = document.createElement(`li`);
  newItem.classList.add(`comments__comment`);
  const avatarWrapper = document.createElement(`div`);
  avatarWrapper.classList.add(`comments__avatar`);
  avatarWrapper.classList.add(`avatar`);
  const avatarImg = document.createElement(`img`);
  avatarImg.setAttribute(`src`, `${avatar}`);
  avatarImg.setAttribute(`alt`, `Аватар пользователя`);
  avatarWrapper.appendChild(avatarImg);
  const commentWrapper = document.createElement(`div`);
  commentWrapper.classList.add(`comments__text`);
  const commentHeadWrapper = document.createElement(`div`);
  commentHeadWrapper.classList.add(`comments__head`);
  const commentHeadText = document.createElement(`p`);
  commentHeadText.innerHTML = `${user} &bull;`;
  const commentHeadTime = document.createElement(`time`);
  commentHeadTime.classList.add(`comments__date`);
  commentHeadTime.setAttribute(`dateTime`, createdAt);
  commentHeadTime.textContent = createdAt;
  commentHeadWrapper.appendChild(commentHeadText);
  commentHeadWrapper.appendChild(commentHeadTime);
  const commentMessage = document.createElement(`p`);
  commentMessage.classList.add(`comments__message`);
  commentMessage.textContent = comment;
  commentWrapper.appendChild(commentHeadWrapper);
  commentWrapper.appendChild(commentMessage);
  newItem.appendChild(avatarWrapper);
  newItem.appendChild(commentWrapper);

  const firstItem = document.querySelector(`.comments__comment:first-child`);
  commentsList.insertBefore(newItem, firstItem);
};


if (commentForm && commentForm.length > 0) {
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
      alert(`Соединение с сервером прервано. Обновите страницу.`);
      return;
    }

    socket.emit(`message`, JSON.stringify(commentJson));
    commentForm.submit();
  });

  socket.addEventListener(`message`, (message) => {
    addCommentOnPostPage(message);
  });
}


const addLastCommentOnMainPage = (message) => {
  const {comment, avatar, user, articleUrl} = JSON.parse(message);
  const newItem = document.createElement(`li`);
  newItem.classList.add(`last__list-item`);
  const newImg = document.createElement(`img`);
  newImg.classList.add(`last__list-image`);
  newImg.setAttribute(`src`, `${avatar}`);
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


if (lastComments && lastComments.length > 0) {
  socket.addEventListener(`message`, (message) => {
    addLastCommentOnMainPage(message);
  });
}

socket.addEventListener(`connect`, () => {
  console.log(`Подключено`);
});

socket.addEventListener(`disconnect`, () => {
  console.log(`Отключён`);
});
