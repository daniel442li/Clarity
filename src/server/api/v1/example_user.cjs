"use strict";

const Joi = require("joi");
const User = require("../../models/user.cjs");
const sharedPromise = import("../../../shared/validation.cjs");

module.exports = (app) => {
    /**
   * Create a new user
   *
   * @param {string} req.body.username - Display name of the new user. It must be unique, contain only alpha-numeric characters, and not include special characters or reserved words like 'password'. Case insensitive.
   * @param {string} [req.body.first_name] - First name of the user. This is an optional field.
   * @param {string} [req.body.last_name] - Last name of the user. This is an optional field.
   * @param {string} [req.body.city] - City the user lives in. This is an optional field.
   * @param {string} req.body.primary_email - Email address of the user. It must be a valid email format, unique across the system, and not in use by another account.
   * @param {string} req.body.password - Password for the user account. It must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@, !, #, $, %, or ^).
   * @return {Object} - Returns an object with the username and primary email of the newly created user. The response status code is 201 for successful creation, and 400 for validation errors.
   *
   * @throws {ValidationError} - Throws a validation error in the following scenarios:
   *   - Missing required fields: Indicates if 'username', 'primary_email', or 'password' are not provided.
   *   - Invalid username: If the username contains special characters or is a reserved word.
   *   - Username or email already in use: Indicates if the username or email is already taken.
   *   - Password Lacks Uppercase Letter: Indicates if the password does not contain at least one uppercase letter.
   *   - Password Lacks Lowercase Letter: Indicates if the password does not contain at least one lowercase letter.
   *   - Password Lacks a Number: Indicates if the password does not include at least one number.
   *   - Password Lacks Special Character: Indicates if the password does not include at least one special character (@, !, #, $, %, or ^).
   */
  
  app.post("/v1/user", async (req, res) => {
    //This shared promise is imported from validation.js
    const { validPassword, validUsername } = await sharedPromise;    
  });
};
