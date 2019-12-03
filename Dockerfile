FROM node:12-alpine

WORKDIR /src
COPY package.json package-lock.json /src/

RUN npm i

COPY . /src/

CMD ["node", "main.js", "leads.csv", "agents.csv"]