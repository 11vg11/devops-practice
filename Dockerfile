FROM node:22-alpine

WORKDIR /app

COPY server.js app.js index.html style.css ./

EXPOSE 3000

CMD ["node", "server.js"]
