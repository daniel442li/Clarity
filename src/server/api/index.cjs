"use strict";

module.exports = (app) => {
  require("./v1/user.cjs")(app);
};
