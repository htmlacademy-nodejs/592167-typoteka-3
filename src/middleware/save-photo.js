'use strict';

const multer = require(`multer`);
const md5 = require(`md5`);

const UPLOAD_DIR = `${__dirname}/../static/upload`;

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
    const fileExtension = MimeTypeExtension[file.mimetype];
    cb(null, `${md5(Date.now())}.${fileExtension}`);
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
}).single(`upload`);

module.exports = (template) => (
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
        res.render(template, {errorMessages: [``]});
        return;
      }
      next();
    });
  }
);
