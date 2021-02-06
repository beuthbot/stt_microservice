FROM python:3.6
WORKDIR /usr/src/app

COPY download.sh ./
RUN sh download.sh

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]