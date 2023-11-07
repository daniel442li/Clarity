"use strict";

const Joi = require("joi");
const User = require("../../models/user.cjs");
const { validPassword, validUsername } = require("../../../shared/validation.cjs");

module.exports = (app) => {

  /* Create a new user
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
    //This shared promise is imported from validation.js  
    const passwordValid = validPassword(req.body.password);
    const usernameValid = validUsername(req.body.username);
    
    if (passwordValid && usernameValid) {
      // TODO: add code to create user
    }
  });
};