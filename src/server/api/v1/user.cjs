"use strict";

const Joi = require("joi");
const User = require("../../models/user.cjs");

module.exports = (app) => {
  app.post("/v1/user", async (req, res) => {
    const sharedModule = await import("../../../shared/validation.cjs");
    const { validPassword, validUsername } = sharedModule;

    // Construct validation schema
    const schema = Joi.object({
      username: Joi.string().required(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      city: Joi.string().optional(),
      primary_email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    // Validate request body against schema
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    // If there's an error, return a 400 response
    if (error) {
      res.status(400).send({ errors: error.details });
      return;
    }

    // Further validate username and password using shared validation methods
    const usernameValidation = validUsername(req.body.username);
    if (usernameValidation) {
      res.status(400).send(usernameValidation);
      return;
    }

    const passwordValidation = validPassword(req.body.password);
    if (passwordValidation) {
      res.status(400).send(passwordValidation);
      return;
    }

    // Check if username or email already exists
    // ** Psuedo-code because actual User model implementation is missing **
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { primary_email: req.body.primary_email }]
    });

    if (existingUser) {
      res.status(400).send({ error: "Username or email already in use" });
      return;
    }

    // Create new user
    // ** Psuedo-code because actual User model implementation and saving logic is missing **
    const newUser = new User({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      city: req.body.city,
      primary_email: req.body.primary_email,
      password: req.body.password
    });

    // Save user or handle any potential errors
    try {
      const savedUser = await newUser.save();
      res.status(201).send({ username: savedUser.username, primary_email: savedUser.primary_email });
    } catch (dbError) {
      res.status(400).send(dbError);
    }
  });
};