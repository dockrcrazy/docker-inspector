FROM node

WORKDIR /app

COPY . /app

RUN npm install --prod

ENTRYPOINT ["node", "app/index.js"]