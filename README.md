# API
## Project Structure
    socialgram/
        ├── Dockerfile
        ├── README.md
        ├── app.js
        ├── config
        │   └── database.js
        ├── controllers
        │   ├── post.js
        │   └── user.js
        ├── docker-compose.dev.yml
        ├── docker-compose.prod.yml
        ├── docker-compose.yml
        ├── middlewares
        │   └── auth.js
        ├── models
        │   ├── post.js
        │   └── user.js
        ├── nginx
        │   └── default.conf
        ├── package-lock.json
        ├── package.json
        ├── routes
        │   ├── post.js
        │   └── user.js
        └── utils
            ├── notFound.js
            └── upload.js
## Getting Stated

### Clone the repository
     git clone https://github.com/rohit1kumar/social-gram.git

### Change the directory
        cd socialgram
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



[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20980024-b024e1ea-c8a8-4013-9879-39bc5bf971c4?action=collection%2Ffork&collection-url=entityId%3D20980024-b024e1ea-c8a8-4013-9879-39bc5bf971c4%26entityType%3Dcollection%26workspaceId%3D1c687d97-092e-4c07-b900-d7384e10b729)