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
    // Define the schema for user input validation
    const schema = Joi.object({
      username: validUsername.required(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      city: Joi.string().optional(),
      primary_email: Joi.string().email().required(),
      password: validPassword.required(),
    });

    // Validate the user input
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username: value.username });
    if (existingUser) {
      return res.status(409).send({ error: 'Username already exists' });
    }

    // Create a new user
    const user = new User(value);
    await user.save();

    // Send the response
    res.status(201).send({
      username: user.username,
      primary_email: user.primary_email,
    });
  });
};
