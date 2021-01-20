'use strict';

const fs = require(`fs`);
const bcrypt = require(`bcrypt`);
const salt = 10;

module.exports = (schema, template) => (
  async (req, res, next) => {
    const {body} = req;
    const user = {
      firstName: body.name,
      lastName: body.surname,
      email: body.email,
      password: body.password,
      repeat: body[`repeat-password`],
    };
    await schema.validateAsync(user, {abortEarly: false})
      .then(async (response) => {
        req.user = response;
        req.user.avatar = req.file !== undefined ? req.file.filename : ``;
        req.user.password = await bcrypt.hash(req.user.password, salt);
        return next();
      })
      .catch((err) => {
        if (req.file !== undefined) {
          fs.unlinkSync(`${__dirname}/../static/upload/${req.file.filename}`);
        }
        const {details} = err;
        res.render(template, {errorMessages: details.map((errorDescription) => errorDescription.message)});

      });
  }
);
