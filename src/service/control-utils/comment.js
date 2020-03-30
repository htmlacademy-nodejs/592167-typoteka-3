'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);
const articleService = require(`./article`);


const getContent = (id) => {
  const article = articleService.getContent().find((el) => el.id === id);
  return article.comments;
};

const remove = (id, commentId) => {
  const answer = {};
  const localContent = articleService.getContent();
  const newArticleList = deleteItemFromArray(localContent, id);
  if (newArticleList !== -1) {
    const mutableArticle = localContent.find((el) => el.id === id);

    const comments = mutableArticle.comments;
    const newComments = {
      comments: deleteItemFromArray(comments, commentId),
    };
    if (newComments.comments === -1) {
      answer.status = 410;
      answer.text = `Возможно комментарий уже был удален`;
      articleService.changeContent(localContent);
      return answer;
    }
    const modifiedArticle = Object.assign({}, mutableArticle, newComments);
    newArticleList.push(modifiedArticle);
    articleService.changeContent(newArticleList);
    answer.status = 204;
    answer.text = ``;
  }

  return answer;
};

const add = (newCommentText, id) => {
  const localContent = articleService.getContent();
  const newComment = {};
  const newArticleList = deleteItemFromArray(localContent, id);
  if (newArticleList !== -1) {
    const mutableArticle = localContent.find((el) => el.id === id);

    newComment.id = getNewId();
    newComment.text = newCommentText.text;

    mutableArticle.comments.push(newComment);
    newArticleList.push(mutableArticle);
    articleService.changeContent(newArticleList);
  }

  return newComment.id;
};


module.exports = {
  remove,
  add,
  getContent,
};
