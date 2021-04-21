'use strict';

const articleRepository = require(`../repositories/article`);
const commentRepository = require(`../repositories/comment`);
const userServices = require(`../services/users`);
const {ArticleNotFoundError} = require(`../errors/errors`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const checkComment = require(`../validation-schemas/comment-shema`);

const {generateDate} = require(`../../utils`);
// const generateDate = (date) => {
//   const createDate = new Date(date);
//   const tempMonth = `${createDate.getMonth()}`.padStart(2, `00`);
//   return `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
// };

const getByArticleId = (articleId) => {
  if (!articleRepository.exists(articleId)) {
    throw new ArticleNotFoundError(articleId);
  }

  return commentRepository.findByArticleId(articleId);
};

const remove = async (commentId) => await commentRepository.remove(commentId);

const add = async (data) => {
  const user = await userServices.getUserInfo(data.username);
  const newComment = {
    articleId: data.articleId,
    userId: user.dataValues.id,
    comment: data.comment,
  };

  checkComment.validateAsync(newComment)
    .then(async (response) => {
      return await commentRepository.save(response);
    })
    .catch((err) => logger.error(err));
};

const getComments = async () => {
  const commentsList = await commentRepository.getComments();
  return Array(commentsList.length).fill({}).map((el, i) => {
    return {
      id: commentsList[i].id,
      articleId: commentsList[i].comments.id,
      comment: commentsList[i].comment,
      createdAt: generateDate(commentsList[i].createdAt),
      title: commentsList[i].comments.title,
      userName: `${commentsList[i].users.firstName} ${commentsList[i].users.lastName}`,
      avatar: commentsList[i].users.avatar,
    };
  });
};

const getCommentsForAtricle = async (articleId) => commentRepository.getCommentsForArticle(articleId);


module.exports = {
  getByArticleId,
  remove,
  add,
  getComments,
  getCommentsForAtricle,
};
