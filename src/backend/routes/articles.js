'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {StatusCode} = require(`http-status-codes`);
const multer = require(`multer`);
const md5 = require(`md5`);

const router = new Router();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const commentService = require(`../services/comment`);
const articleService = require(`../services/article`);
const {ArticleNotFoundError} = require(`../errors/errors`);
const {MOCK_USER_ID, FRONTEND_URL} = require(`../../constants`);

const UPLOAD_DIR = `${__dirname}/../../static/upload`;

const MimeTypeExtension = {
  'image/png': `png`,
  'image/jpeg': `jpg`,
  'image/jpg': `jpg`,
};

const maxFileSize = 5 * 1024 * 1024;

// Подготовка хранилища для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const fileExtention = MimeTypeExtension[file.mimetype];
    cb(null, `${md5(Date.now())}.${fileExtention}`);
  },
});

// Функция определяющая допустимые файлы для загрузки
const fileFilter = (req, file, cb) => {
  const allowTypes = Object.keys(MimeTypeExtension);
  const isValid = allowTypes.includes(file.mimetype);
  cb(null, isValid);
};

const upload = multer({
  storage, fileFilter, limits: {
    fileSize: maxFileSize,
  }
});


router.get(`/`, async (req, res) => {
  try {
    const articles = await articleService.getAllElementsForMainPage(req.query);
    res.send(articles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/previewsForMainPage`, async (req, res) => {
  try {
    const articles = await articleService.getPreviewsForMainPage(req.query);
    const preparedListArticles = articles.slice(0).map((it) => {
      it.categories = it.categories.split(`, `);
      return it;
    });
    res.send(preparedListArticles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/comments`, async (req, res) => {
  try {
    res.send(await articleService.getLastComments());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await articleService.getMostDiscussed());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/countAllArticles`, async (req, res) => {
  try {
    res.send(await articleService.getCountAllArticles());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});

router.get(`/myArticles`, async (req, res) => {
  try {
    res.send(await articleService.getMyArticles(MOCK_USER_ID));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});


router.get(`/categories/:id`, async (req, res) => {
  try {
    res.send(await articleService.getArticlesForCategory(req.params.id));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});

router.get(`/:articleId`, async (req, res) => {
  try {
    if (req.query.extension === `isFetch`) {
      res.json(await articleService.getArticleById(req.params.articleId, `edit`));
    } else {
      res.send(await articleService.getArticleById(req.params.articleId, req.query.extension));
    }
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        message: `Internal service error`
      });
    }
  }
});

router.post(`/add`, upload.single(`newArticlePhoto`), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file.filename;

    await articleService.create(data);
    res.redirect(`${FRONTEND_URL}/my`);
  } catch (err) {
    res.send(err);
  }
});

router.post(`/:articleId/comments`, async (req, res) => {
  try {
    const data = req.body;
    data.articleId = req.params.articleId;
    commentService.add(data);
    res.redirect(`${FRONTEND_URL}/articles/${req.params.articleId}`);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.post(`/edit/:articleId`, upload.single(`newArticlePhoto`), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file.filename;

    await articleService.edit(data, req.params.articleId);
    res.redirect(`${FRONTEND_URL}/my`);
  } catch (err) {
    res.send(``);
  }
});

router.get(`/delete/:articleId`, async (req, res) => {
  try {
    await articleService.remove(req.params.articleId);
    return res.json({isDelete: true});
  } catch (err) {
    logger.error(err);
    return res.json({isDeleted: `${err.message}`});
  }
});


module.exports = router;
