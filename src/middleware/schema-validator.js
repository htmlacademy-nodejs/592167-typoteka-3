'use strict';

const fs = require(`fs`);

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
      .then((response) => {
        req.user = response;
        req.user.avatar = req.file !== undefined ? req.file.filename : ``;
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
