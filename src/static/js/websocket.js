'use strict';

const FRONTEND_URL = `http://localhost:8080`;

// eslint-disable-next-line no-undef
const socket = io(FRONTEND_URL);
// eslint-disable-next-line no-undef
const commentForm = document.querySelector(`.comment-form`);
// eslint-disable-next-line no-undef
const commentText = document.querySelector(`.comment-text`);
// eslint-disable-next-line no-undef
const lastList = document.querySelector(`.last__list`);
// eslint-disable-next-line no-undef
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
    // eslint-disable-next-line no-undef
    // commentForm.submit();
  });
}

// <li className="last__list-item">
//   <img className="last__list-image"
//        src="/upload/60daa1e52695dc9c849b50b63204a19c.jpg"
//        width="20"
//        height="20"
//        alt="Аватар пользователя">
//   <b className="last__list-name">Сидоров Виктор</b>
//   <a className="last__list-link" href="/articles/5">Мне кажется или я уже читал это где-то?</a>
// </li>

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
  lastList.appendChild(newItem);
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
