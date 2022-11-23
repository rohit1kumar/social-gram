FROM node:16
WORKDIR /app
COPY package.json . 
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --production; \
    fi

COPY . ./
EXPOSE 3000
CMD ["node", "app.js"]
