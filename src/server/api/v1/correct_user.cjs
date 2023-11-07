"use strict";

const Joi = require("joi");
const sharedPromise = import("../../../shared/validation.cjs");

module.exports = (app) => {
  /**
   * Create a new user
   *
   * @param {req.body.username} Display name of the new user
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.city} City user lives in - optional
   * @param {req.body.primary_email} Email address of the user
   * @param {req.body.password} Password for the user
   * @return {201, {username,primary_email}} Return username and others
   */
  app.post("/v1/user", async (req, res) => {
    const { validPassword, validUsername } = await sharedPromise;
    // Schema for user info validation
    const schema = Joi.object({
      username: Joi.string().lowercase().alphanum().min(3).required(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      city: Joi.string(),
      primary_email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    try {
      let data = await schema.validateAsync(req.body);

      // Validate the username and password

      const usernameValidationResult = validUsername(data.username);
      if (usernameValidationResult) {
        return res.status(400).send({ error: usernameValidationResult.error });
      }


      // Additional password validation
      const passwordValidationResult = validPassword(data.password);
      if (passwordValidationResult) {
        return res.status(400).send({ error: passwordValidationResult.error });
      }

      try {
        const user = new app.models.User(data);
        await user.save();

        res.status(201).send(user);
      } catch (err) {
        console.log(err);
        res.status(400).send({ error: `username already in use` });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: err.details[0].message });
    }
  });
};
