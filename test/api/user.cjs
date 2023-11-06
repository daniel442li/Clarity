"use strict";

const should = require("should");
const assert = require("assert");
const request = require("superagent");
const harness = require("./harness.cjs");
const data = require("./data");
let config = {};
let users = data.users;
const envConfig = require("simple-env-config");
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "test";

describe("User:", () => {
  let primaryAgent = request.agent();
  let anonAgent = request.agent();
  before(async () => {
    config = await envConfig("./config/config.json", env);
    config.url = `${config.url}:${config.port}${config.api_version}/`;
    await harness.setup(config.mongodb);
  });
  after(async () => {
    await harness.shutdown();
  });

  describe("Create:", () => {
    it("Failure - missing required username", async () => {
      try {
        await primaryAgent.post(`${config.url}user`).send({
          first_name: users.primary.first_name,
          last_name: users.primary.last_name,
        });
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal('"username" is required');
      }
    });
    it("Failure - missing required address", async () => {
      try {
        await primaryAgent.post(`${config.url}user`).send({
          first_name: users.primary.first_name,
          last_name: users.primary.last_name,
          username: users.primary.username,
          password: users.primary.password,
        });
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal('"primary_email" is required');
      }
    });
    it("Failure - missing required password", async () => {
      try {
        await primaryAgent.post(`${config.url}user`).send({
          first_name: users.primary.first_name,
          last_name: users.primary.last_name,
          username: users.primary.username,
          primary_email: users.primary.primary_email,
        });
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal('"password" is required');
      }
    });
    it("Failure - malformed username -- bad chars", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.username = "@yys7! foobar";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          '"username" must only contain alpha-numeric characters',
        );
      }
    });
    it("Failure - malformed username -- reserved word", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.username = "password";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal("invalid username");
      }
    });
    it("Failure - malformed address", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.primary_email = "not.a.real.address-com";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          '"primary_email" must be a valid email',
        );
      }
    });
    it("Failure - malformed password -- too short", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.password = "1234567";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          '"password" length must be at least 8 characters long',
        );
      }
    });
    it("Failure - malformed password -- need at least one uppercase", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.password = "!1234asdf";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          "Password must contain an uppercase letter",
        );
      }
    });
    it("Failure - malformed password -- need at least one lowercase", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.password = "!1234ASDF";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          "Password must contain a lowercase letter",
        );
      }
    });
    it("Failure - malformed password -- need at least one number", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.password = "!ASDFasdf";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal("Password must contain a number");
      }
    });
    it("Failure - malformed password -- need at least one symbol", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.password = "1234Asdf";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal(
          "Password must contain @, !, #, $, % or ^",
        );
      }
    });
    it("Success - return 201 and username and ...", async () => {
      const res = await primaryAgent
        .post(`${config.url}user`)
        .send(users.primary);
      res.status.should.equal(201);
      res.body.username.should.equal(users.primary.username);
      res.body.primary_email.should.equal(users.primary.primary_email);
    });
    it("Failure - already used username", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.primary_email = "randomemailname@randomaddress.com";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal("username already in use");
      }
    });
    it("Failure - case insensitivity", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.username = data.username.toUpperCase();
        data.primary_email = "goo@bar.com";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal("username already in use");
      }
    });
    it("Failure - already used email address", async () => {
      try {
        let data = Object.assign({}, users.primary);
        data.username = "randomusername";
        await primaryAgent.post(`${config.url}user`).send(data);
      } catch ({ response }) {
        response.status.should.equal(400);
        response.body.error.should.equal("email address already in use");
      }
    });
  });
});
