# Agent Testing Framework

### Server-Side Workflow Support

There are a number of things that need to get upgraded throughout the application.  You need to support CRUD actions for users.  This means that a user should be able to register, log in and out, view profiles and modify their profile (eventually).  A user should also be able to create a new game, and mark a game as either deleted or completed (these are both valid choices - though we have no UI that can support this yet).

* The registration page itself doesn't need to change, but the server side now need to properly support creation of documents in the Users collection in the database
    * This route is outlined in ***src/server/api/v1/user.cjs*** at POST _/v1/user_.
    

