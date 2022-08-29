# API
## Project Structure

    api/
    ├─ config/
    │  ├─ config.env
    │  ├─ database.js
    ├─ controller/
    │  ├─ post.js
    │  ├─ user.js
    ├─ modals/
    │  ├─ post.js
    │  ├─ user.js
    ├─ middleware/
    │  ├─ auth.js
    ├─ routes/
    │  ├─ post.js
    │  ├─ user.js
    ├─ utils/
    │  ├─ notFound.js
    │  ├─ upload.js
    ├─ package-lock.json
    ├─ package.json
    ├─ README.md
    ├─ app.js


## Getting Stated

### Clone the repository
     git clone https://github.com/rohit1kumar/social-gram.git


### Install dependencies
     cd social-gram
     npm install

### Add environment variables
    PORT=3000
    MONGO_URL=mongodb://localhost:27017/dbname
    JWT_SECRET=secret
    CLOUDINARY_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

*visit https://cloudinary.com/ click on 'Configure your SDK' to get cloudinary credentials*


### Build and run the project
     npm start

### Base URL
    https://social-gramm.herokuapp.com/api/v1/

## Endpoints

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