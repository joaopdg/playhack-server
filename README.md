# PlayHack

<br>

# Quick Compo

A hub of ironhack's web dev bootcamp games. A place to share your first project and check for ideas!

<br>


## Description

Play Hack is a platform that gathers the first project of Web Dev Bootcamp from all Ironhack's campuses. The goal is to create a place where all students can share their games, the ideia behind them, try other cohorts projects but most of all, have fun!

## User Stories

-  **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it's my fault.
-  **Signup:** As an anonymous user I can sign up on the platform so that I can upload my game.
-  **Login:** As a user I can login to the platform so that I can access my profile and upload my game.
-  **Logout:** As a logged in user I can logout from the platform so no one else can use it.
-  **Profile Page**: As a logged in user I can visit my profile page so that I can access the edit page to edit the profile or delete it.
-  **Add Game:** As a logged in user I can access the add game page so that I can upload my game.
-  **Edit Game:** As a logged in user I can access the edit game page so that I can edit the info of the game I uploaded.
-  **Delete game:** As a logged in user I can delete the games I created.
-  **Add comments:** As a user I can create comments.
-  **Delete comments:** As a user I can delete the comments I created.
-  **All Games:** As a user I can see the list of all of the available games on the platform.
-  **View Rating:** As a user I can see the rating list of the available games on the platform.
-  **View Rating:** As a logged in user I can rate all of the available games on the platform.



## Backlog

- users can comment
- users can play the games
- users can rate the games


<br>


# Client / Frontend

## React Router Routes (React App)

| Path                         | Component            | Permissions                | Behavior                                                  |
| ---------------------------- | -------------------- | -------------------------- | --------------------------------------------------------- |
| `/login`                     | LoginPage            | anon only `<AnonRoute>`    | Login form, navigates to home page after login.           |
| `/signup`                    | SignupPage           | anon only  `<AnonRoute>`   | Signup form, navigates to home page after signup.         |
| `/`                          | HomePage             | public `<Route>`           | Home page.                                                |
| `/profile:id`                | ProfilePage          | user only `<PrivateRoute>` | Allows the user to check User profile page.               |
| `/profile:id/edit`           | EditProfilePage      | user only `<PrivateRoute>` | Edit user profile form.                                   |
| `/game/add`                  | CreateGamePage       | user only `<PrivateRoute>` | Create new game form.                                     |
| `/gamesList`                 | GameListPage         | public `<Route>`           | Games list.                                               |
| `/game:id`                   | GameDetailsPage      | public `<Route>`           | Allows anyone to play the specific game                   |
| `/game:id/edit`              | GameDetailsEditPage  | user only `<PrivateRoute>` | Allows the creator of the game to edit its info           |




## Components

Pages:

- LoginPage

- SignupPage

- HomePage

- ProfilePage

- EditProfilePage

- SubmitGamePage

- GamesListPage

- GameDetailsPage

- EditGamePage



Components:

- profile
- game
- ratings
- Navbar
- comments





## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

- **Game Service**

  - `gameService` :
    - `.addGame(gameData)`
    - `.getGame()`
    - `.getOneGame(id)`
    - `.deleteGame(id)`




<br>


# Server / Backend


## Models

**User model**

```javascript
{
  name: { 
	  type: String, 
	  required: true
  },
  email: { 
	  type: String, 
	  required: true, 
	  unique: true 
  },
  password: { 
	  type: String, 
	  required: true 
  },
  imageUrl:{
	  type: String,
	  default:"linklinlink.link"
	  }
  bio: { type:String },
  cohort: { type:String },
  cohortType: { 
	  type:String,
	  enum:["In person", "Remote"]
  },  
  campus: {
	type:String,
	enum:["Lisbon", "Berlin", "London", "Barcelona", "Madrid", "Amsterdam", "Miami", "New York City", "Tampa", "Mexico City", "São Paulo"]
   },
  likedGames: [{ type: Schema.Types.ObjectId, ref:'Game' }],
  games: [ { type: Schema.Types.ObjectId, ref:'Game' } ],
  comments: [ { type: Schema.Types.ObjectId, ref:'Comments' } ]

}
```



**Game model**

```javascript
 {
   title: { 
	   type: String, 
	   required: true 
	},
   gameUrl: { 
	   type: String , 
	   required: true 
	},
   description: {
	   type: String , 
	   required: true
	},
   thumbnail:{
	   type:String,
	   default:"linklinklinklink.link"
	},
   category : {
	type:String,
	required: true,
	enum:["Action", "Arcade", "Adventure", "Racing", "Puzzle", "Shooting", "Sports", "Other"]
   }, 
   creator: { type: Schema.Types.ObjectId, ref:'User' } ,
   comments:[ { type: Schema.Types.ObjectId, ref:'Comments' } ],   
   timesPlayed: {type: Number},
   likes: {type: Number},
 }, 
{timestampes:true}
```



**Comments model**

```javascript
{
   content: { type: String },
   game:  { type: Schema.Types.ObjectId, ref:'Game' } ,
   user:  { type: Schema.Types.ObjectId, ref:'User' } ,
}
```


<br>


## API Endpoints (backend routes)

| HTTP Method | URL                    | Request Body                 | Success status | Error Status | Description                                                    |
| ----------- | ---------------------- | ---------------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| GET         | `/auth/profile    `    | Saved session                | 200            | 404          | Check if user is logged in and return profile page             |
| POST        | `/auth/signup`         | {name, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`          | {email, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| PUT         | `/auth/profile:id/edit`| {name, email, password, imageUrl,bio, cohort, cohortType, campus }| 200            | 404          | returns the profile form to edit info|
| POST        | `/auth/logout`         |                              | 204            | 400          | Logs out the user                                              |
| GET         | `/api/games`           | [{title, game_url,creator, description, comments, category, thumbnail}]|                | 400          | Show all games       |
| GET         | `/api/games/:id`       | {title, game_url,creator, description, comments, category, thumbnail}|                |              | Show specific game     |
| POST        | `/api/submit-game`     | {title, game_url, description,category, thumbnail}      | 201                    | 400                 | Submit new game      |
| PUT         | `/api/games/:id/edit`  | {title, game_url, description,category, thumbnail}      | 200               | 400                  | Edit submited game       |
| DELETE      | `/api/games/:id`       |                              | 201            | 400          | delete game                                                    |
   

<br>

## API's

<br>

## Packages
axios, react-router-dom, styled-components

<br>


## Links

### Trello/Kanban

(https://trello.com/b/bxzbAEPg/project-3) 
### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/screeeen/project-client)- comming soon

[Server repository Link](https://github.com/screeeen/project-server)- comming soon

[Deployed App Link](http://heroku.com) -  comming soon

### Slides

[Slides Link](http://slides.com) - comming soon

### Contributors

Mariana Oliveira - https://github.com/miloliveira - https://www.linkedin.com/in/miloliveira/

João Gonçalves - https://github.com/joaopdg - https://www.linkedin.com/in/joaopdg/
