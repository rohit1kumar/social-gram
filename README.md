# Socialgram - A production grade social network

## ExpressJS + MongoDB + Ngnix + Docker Compose


## Introduction
This project is a production grade MVP of a social network.
In this project I've used ExpressJS for the backend, MongoDB for production database, Nginx for revrese proxy and load balancing.
Then I have Dockerize my project into 3 containers. i.e nodeapp (ExpressJS), mongo (MongoDB), nginx (Nginx).
And finally I've used Docker Compose for running multiple containers as a single service.
## Infrastructre Diagram of Socialgram
![Infrastructre Diagram of Socialgram](https://i.imgur.com/VGSOP7E.png)

## Walkthrough of Socialgram API
(Note: While creating the project my aim was to focus enterily in the Backend part and infra part) \
    The API has minimal features like:
User Authentication (Login, Signup, Logout) and
Allows the user to create & remove a post with caption & image, Like & unlike a post, Follow & unfollow users, Get
user posts & profiles, Add & remove a comment, Update profile & password, etc.\
    Constructed an authentication system using JWT. \

TODO: will be adding frontend, along with caching


## How to run this project
### Clone the repository
    git clone https://github.com/rohit1kumar/social-gram.git

### Change the directory
    cd social-gram
### Add environment variables
    PORT=3000
    JWT_SECRET=<JWT_SECRET>
    CLOUDINARY_NAME=<CLOUDINARY_NAME>
    CLOUDINARY_API_KEY=<CLOUDINARY_API_KEY>
    CLOUDINARY_API_SECRET=<CLOUDINARY_API_SECRET>

*visit https://cloudinary.com/ click on 'Configure your SDK' to get cloudinary credentials*

### Build and run the project in docker
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
### Stop and remove the containers
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
### Base URL
    http://localhost:3000/api/v1
## API Endpoints

|  REQUEST  |  ENDPOINT         |  DESCRIPTION
|    ---    |    ---            |     ---
| POST      | /register         | Register user with name, email and password (or add avatar)
| POST      | /login            | Login
| GET       | /logout           | Logout
| GET       | /follow/:id       | Follow a user by user's id
| GET       | /me               | Get the loginned user profile
| GET       | /my/posts         | Get loginned user's all posts
| GET       | /userposts:id     | Get user's post by user's id
| GET       | /user/:id         | Get user's profile
| GET       | /users            | Find user by 'name' query string
| PUT       | /update/password  | update password with oldPassword and newPassword
| PUT       | /update/profile   | Update profile by name or email or avatar
| GET       | /posts            | Get the post of following
| POST      | /post/upload      | Create a post by caption & image
| POST      | /post/:id         | Like & unlike a post by post's id (toggle)
| POST      | /post/comment/:id | Comment on the post by post's id
| DELETE    | /post/:id         | Delete a post by post's id
| DELETE    | /post/comment/:id | Delete the comment of the post by comment's id


### Use Postman to test the API endpoints
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20980024-b024e1ea-c8a8-4013-9879-39bc5bf971c4?action=collection%2Ffork&collection-url=entityId%3D20980024-b024e1ea-c8a8-4013-9879-39bc5bf971c4%26entityType%3Dcollection%26workspaceId%3D1c687d97-092e-4c07-b900-d7384e10b729)