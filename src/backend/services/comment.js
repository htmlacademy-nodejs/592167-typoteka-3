'use strict';

const articleRepository = require(`../repositories/article`);
const commentRepository = require(`../repositories/comment`);
const {CommentNotFoundError, ArticleNotFoundError} = require(`../errors/errors`);
const {MOCK_USER_ID} = require(`../../constants`);

const createDateForPreview = (date) => {
  const createDate = new Date(date);
  const tempMonth = `${createDate.getMonth()}`.padStart(2, `00`);
  return `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
};

const getByArticleId = (articleId) => {
  if (!articleRepository.exists(articleId)) {
    throw new ArticleNotFoundError(articleId);
  }

  return commentRepository.findByArticleId(articleId);
};

const remove = (articleId, commentId) => {
  if (!commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(articleId, commentId);
  }

  return commentRepository.remove(articleId, commentId);
};

const add = (data) => {
  const newComment = {
    articleId: data.articleId,
    userId: MOCK_USER_ID,
    comment: data.comment,
  };
  return commentRepository.save(newComment);
  // if (!articleRepository.exists(articleId)) {
  //   throw new ArticleNotFoundError(articleId);
  // }
  //
  // return commentRepository.save(newCommentText.text, articleId);
};

const getCommentsByUser = async (userId) => {
  const commentsList = await commentRepository.getCommentsByUser(userId);
  return Array(commentsList.length).fill({}).map((el, i) => {
    return {
      articleId: commentsList[i].comments.id,
      comment: commentsList[i].comment,
      createdAt: createDateForPreview(commentsList[i].createdAt),
      title: commentsList[i].comments.title,
      userName: `${commentsList[i].users.firstName} ${commentsList[i].users.lastName}`,
    };
  });
};


module.exports = {
  getByArticleId,
  remove,
  add,
  getCommentsByUser,
};
