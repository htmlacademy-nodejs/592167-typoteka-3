'use strict';

const fs = require(`fs`).promises;
const axios = require(`axios`);
const { BACKEND_URL } = require(`../../constants`);

const {Router} = require(`express`);
const router = new Router();

router.get(`/category/:id`, (req, res) => res.send(req.originalUrl));

router.get(`/add`, (req, res) => {
  res.render(`new-post`);
});

router.post(`/add`, async (req, res) => {
  try {
    const {type, size, path, name} = req.files.newArticlePhoto;
    const allowTypes = [`image/jpeg`, `image/png`];

    const newArticles = {
      title: req.fields.newArticleTitle,
      createDate: `4/24/2020, 1:28:54 PM`,
      announce: req.fields.newArticleAnnounce,
      fullText: req.fields.newArticleFullText,
      categories: [
        `За жизнь`,
        `Дорога`
      ],
      comments: [],
    };

    if (size === 0 || !allowTypes.includes(type)) {
      fs.unlink(path);
      return res.redirect(`my`);
    }

    axios.post(`${BACKEND_URL}/api/articles`, newArticles);

    return res.redirect(`/my`);
  } catch (err) {
    res.render(`errors/500`, {err});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}`);
  // console.log(response.data);
  res.send(req.originalUrl)
});

router.get(`/:id`, (req, res) => res.send(req.originalUrl));

module.exports = router;
