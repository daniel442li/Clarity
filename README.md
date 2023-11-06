# CS 4288: Web-based System Architecture 
## Programming Assignment 4

# Overview

For this assignment you are to begin building out the server-side of your application.  If done properly, this should blend seamlessly with the React-based SPA client developed in Assignment #3.  Listed below are the requirements for the specific enhancements you need to make and how they will be graded.  Follow the directions closely!

### Server-Side Workflow Support

There are a number of things that need to get upgraded throughout the application.  You need to support CRUD actions for users and games.  This means that a user should be able to register, log in and out, view profiles and modify their profile (eventually).  A user should also be able to create a new game, and mark a game as either deleted or completed (these are both valid choices - though we have no UI that can support this yet).

* The registration page itself doesn't need to change, but the server side now need to properly support creation of documents in the Users collection in the database. (10pts)
    * This route is outlined in ***src/server/api/v1/user.cjs*** at POST _/v1/user_.
    
* We are not to the point of actually playing a game yet.  You do not need to implement actual game moves.


