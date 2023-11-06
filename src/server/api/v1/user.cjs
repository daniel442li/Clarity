"use strict";

const Joi = require("joi");
const User = require("../../models/user.cjs");
const sharedPromise = import("../../../shared/validation.js");

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
    const schema = Joi.object({
  username: Joi.string().alphanum().required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  city: Joi.string().optional(),
  primary_email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const { error, value } = schema.validate(req.body);

if (error) {
  return res.status(400).send({ error: error.details[0].message });
}

const usernameError = validUsername(value.username);
if (usernameError) {
  return res.status(400).send(usernameError);
}

const passwordError = validPassword(value.password);
if (passwordError) {
  return res.status(400).send(passwordError);
}

const existingUser = await User.findOne({ username: value.username });
if (existingUser) {
  return res.status(400).send({ error: "username already in use" });
}

const existingEmail = await User.findOne({ primary_email: value.primary_email });
if (existingEmail) {
  return res.status(400).send({ error: "email address already in use" });
}

const user = new User(value);
await user.save();

res.status(201).send({
  username: user.username,
  primary_email: user.primary_email,
});
  });
};
