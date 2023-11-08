"use strict";

const User = require("../../models/user.cjs");

module.exports = (app) => {
  app.post("/v1/user", async (req, res) => {
    try {
      const { username, first_name, last_name, city, primary_email, password } = req.body;
      // Create user schema validation here (this is a partial validation based on provided tests)
      if (!username || !primary_email || !password) {
        return res.status(400).json({ error: 'Missing username, primary_email, or password' });
      }

      // Additional simple validations based on provided information, should be replaced with actual Joi validations
      if (username.length < 3 || username.length > 15 || !username.match(/^[a-z0-9]+$/i)) {
        return res.status(400).json({ error: 'Username is not valid' });
      }

      // Check for unique username
      const existingUser = await User.findOne({ username }).exec();
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check for unique email
      const existingEmail = await User.findOne({ primary_email }).exec();
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Password validation using sharedPromise
      const { validUsername, validPassword } = require("../../../shared/validation.cjs");
      
      if (validUsername(username)) {
        return res.status(400).json(validUsername(username));
      }

      const passwordError = validPassword(password);
      if (passwordError) {
        return res.status(400).json(passwordError);
      }

      // If validation passes, create a new user
      const newUser = new User({ username, first_name, last_name, city, primary_email });
      newUser.password = password; // This should trigger User model's password set method which encrypts the password
      await newUser.save();

      return res.status(201).json({ username, primary_email });
    } catch (err) {
      // Handle unexpected errors
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};